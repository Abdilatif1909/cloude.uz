from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.books.views import BookViewSet
from apps.materials.views import LectureViewSet, PracticalViewSet

router = DefaultRouter()
router.register("lectures", LectureViewSet, basename="lectures")
router.register("practicals", PracticalViewSet, basename="practicals")
router.register("books", BookViewSet, basename="books")

urlpatterns = [path("", include(router.urls))]
