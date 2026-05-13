from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.materials.views import LectureViewSet, PracticalViewSet

app_name = "materials"

router = DefaultRouter()
router.register("lectures", LectureViewSet, basename="lectures")
router.register("practicals", PracticalViewSet, basename="practicals")

urlpatterns = [path("", include(router.urls))]
