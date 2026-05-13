from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.assessments.views import QuestionViewSet, ResultViewSet, TestViewSet

router = DefaultRouter()
router.register("tests", TestViewSet, basename="tests")
router.register("questions", QuestionViewSet, basename="questions")
router.register("results", ResultViewSet, basename="results")

urlpatterns = [path("", include(router.urls))]
