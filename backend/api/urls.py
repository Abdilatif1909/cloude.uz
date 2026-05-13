from django.urls import include, path

urlpatterns = [
    path("auth/", include("api.auth_urls")),
    path("", include("api.content_urls")),
    path("", include("api.test_urls")),
    path("search/", include("api.search_urls")),
]
