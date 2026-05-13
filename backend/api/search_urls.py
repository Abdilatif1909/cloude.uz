from django.urls import path

from apps.search.views import SearchAPIView

urlpatterns = [path("", SearchAPIView.as_view(), name="search")]
