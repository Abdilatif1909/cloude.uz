from django.contrib import admin
from django.db.models import Avg, Count

from apps.assessments.models import Question, Result, Test


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "created_at", "question_total", "average_score")
    search_fields = ("title", "created_by__username", "created_by__full_name")
    list_filter = ("created_at",)
    inlines = [QuestionInline]

    def question_total(self, obj):
        return obj.questions.count()

    def average_score(self, obj):
        return round(obj.results.aggregate(avg=Avg("score"))["avg"] or 0, 2)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("test", "short_question", "correct_answer")
    search_fields = ("question", "test__title")
    list_filter = ("correct_answer",)

    def short_question(self, obj):
        return obj.question[:80]


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("student", "test", "score", "created_at")
    search_fields = ("student__username", "student__full_name", "test__title")
    list_filter = ("created_at", "test")

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        queryset = self.get_queryset(request)
        extra_context["total_results"] = queryset.count()
        extra_context["average_score"] = round(queryset.aggregate(avg=Avg("score"))["avg"] or 0, 2)
        extra_context["student_count"] = queryset.aggregate(total=Count("student", distinct=True))["total"]
        return super().changelist_view(request, extra_context=extra_context)
