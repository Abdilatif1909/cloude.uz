from rest_framework import serializers

from apps.assessments.models import Question, Result, Test


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "id",
            "test",
            "question",
            "option_a",
            "option_b",
            "option_c",
            "option_d",
            "correct_answer",
        ]


class TestSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.display_name", read_only=True)
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = Test
        fields = [
            "id",
            "title",
            "description",
            "difficulty",
            "estimated_time",
            "created_by",
            "created_by_name",
            "question_count",
            "created_at",
        ]
        read_only_fields = ["id", "created_by", "created_by_name", "question_count", "created_at"]


class TestDetailSerializer(TestSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta(TestSerializer.Meta):
        fields = TestSerializer.Meta.fields + ["questions"]


class TestStartQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "question", "option_a", "option_b", "option_c", "option_d"]


class TestStartSerializer(serializers.ModelSerializer):
    questions = TestStartQuestionSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source="created_by.display_name", read_only=True)
    question_count = serializers.IntegerField(source="questions.count", read_only=True)

    class Meta:
        model = Test
        fields = ["id", "title", "description", "difficulty", "estimated_time", "created_by_name", "question_count", "questions"]


class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.display_name", read_only=True)
    test_title = serializers.CharField(source="test.title", read_only=True)
    completion_percent = serializers.SerializerMethodField()

    class Meta:
        model = Result
        fields = [
            "id",
            "student",
            "student_name",
            "test",
            "test_title",
            "score",
            "total_questions",
            "answered_count",
            "time_spent_seconds",
            "completion_percent",
            "answer_payload",
            "created_at",
        ]
        read_only_fields = ["id", "student_name", "test_title", "created_at"]

    def get_completion_percent(self, obj):
        if not obj.total_questions:
            return 0
        return round((obj.answered_count / obj.total_questions) * 100, 1)


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.ChoiceField(choices=["A", "B", "C", "D"])


class TestSubmitSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)
    elapsed_seconds = serializers.IntegerField(required=False, min_value=0)

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError("At least one answer is required.")
        return value
