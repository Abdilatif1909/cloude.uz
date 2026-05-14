from django.shortcuts import redirect
from rest_framework import decorators, response, viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from apps.materials.models import Lecture, Practical
from apps.materials.serializers import LectureSerializer, PracticalSerializer
from services.pdf_import_service import ensure_pdf_library_seeded
from utils.permissions import IsTeacherOrAdminOrReadOnly


class BaseMaterialViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTeacherOrAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["title", "uploaded_at"]

    def get_queryset(self):
        ensure_pdf_library_seeded()
        return super().get_queryset()

    @decorators.action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        instance = self.get_object()
        if instance.download_url:
            return redirect(instance.download_url)
        return response.Response({"detail": "PDF URL mavjud emas."}, status=404)


class LectureViewSet(BaseMaterialViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer


class PracticalViewSet(BaseMaterialViewSet):
    queryset = Practical.objects.all()
    serializer_class = PracticalSerializer
