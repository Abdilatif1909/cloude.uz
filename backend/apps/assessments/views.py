from django.db.models import Q
from rest_framework import decorators, permissions, response, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter, SearchFilter

from apps.assessments.models import Question, Result, Test
from apps.assessments.serializers import (
    QuestionSerializer,
    ResultSerializer,
    TestDetailSerializer,
    TestSerializer,
    TestStartSerializer,
    TestSubmitSerializer,
)
from services.test_service import create_result
from utils.constants import ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER
from utils.permissions import IsTeacherOrAdmin, IsTeacherOrAdminOrReadOnly


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all().select_related("created_by").prefetch_related("questions")
    permission_classes = [IsTeacherOrAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "created_by__username", "created_by__full_name"]
    ordering_fields = ["title", "created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and user.role == ROLE_TEACHER:
            return queryset.filter(created_by=user)
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return TestDetailSerializer
        return TestSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        if self.request.user.role == ROLE_TEACHER and instance.created_by != self.request.user:
            raise PermissionDenied("You can only update your own tests.")
        serializer.save()

    @decorators.action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def start(self, request, pk=None):
        serializer = TestStartSerializer(self.get_object())
        return response.Response(serializer.data)

    @decorators.action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        if request.user.role != ROLE_STUDENT:
            return response.Response({"detail": "Only students can submit tests."}, status=status.HTTP_403_FORBIDDEN)

        test = self.get_object()
        serializer = TestSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        questions = list(test.questions.all())
        question_ids = {question.id for question in questions}
        answers = {item["question_id"]: item["answer"] for item in serializer.validated_data["answers"]}

        invalid_question_ids = [question_id for question_id in answers if question_id not in question_ids]
        if invalid_question_ids:
            return response.Response(
                {"detail": f"Invalid question ids: {invalid_question_ids}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = create_result(
            request.user,
            test,
            questions,
            answers,
            time_spent_seconds=serializer.validated_data.get("elapsed_seconds", 0),
        )
        return response.Response(ResultSerializer(result).data, status=status.HTTP_201_CREATED)

    @decorators.action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def teacher_results(self, request):
        if request.user.role not in {ROLE_TEACHER, ROLE_ADMIN}:
            return response.Response({"detail": "Only teachers and admins can view this endpoint."}, status=status.HTTP_403_FORBIDDEN)

        results = Result.objects.select_related("student", "test")
        if request.user.role == ROLE_TEACHER:
            results = results.filter(test__created_by=request.user)
        serializer = ResultSerializer(results, many=True)
        return response.Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().select_related("test")
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacherOrAdmin]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["question", "test__title"]
    ordering_fields = ["id"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == ROLE_TEACHER:
            queryset = queryset.filter(test__created_by=self.request.user)
        query = self.request.query_params.get("test")
        if query:
            queryset = queryset.filter(test_id=query)
        return queryset

    def perform_create(self, serializer):
        test = serializer.validated_data["test"]
        if self.request.user.role == ROLE_TEACHER and test.created_by != self.request.user:
            raise PermissionDenied("You can only add questions to your own tests.")
        serializer.save()

    def perform_update(self, serializer):
        test = serializer.validated_data.get("test", serializer.instance.test)
        if self.request.user.role == ROLE_TEACHER and test.created_by != self.request.user:
            raise PermissionDenied("You can only edit questions from your own tests.")
        serializer.save()


class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["student__username", "student__full_name", "test__title"]
    ordering_fields = ["score", "created_at"]

    def get_queryset(self):
        queryset = Result.objects.select_related("student", "test", "test__created_by")
        user = self.request.user
        search = self.request.query_params.get("q")
        if search:
            queryset = queryset.filter(
                Q(student__username__icontains=search)
                | Q(student__full_name__icontains=search)
                | Q(test__title__icontains=search)
            )
        if user.role == ROLE_STUDENT:
            return queryset.filter(student=user)
        if user.role == ROLE_TEACHER:
            return queryset.filter(test__created_by=user)
        return queryset
