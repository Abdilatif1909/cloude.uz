from django.db.models import Q
from rest_framework import permissions, response, views

from apps.books.serializers import BookSerializer
from apps.books.models import Book
from apps.materials.models import Lecture, Practical
from apps.materials.serializers import LectureSerializer, PracticalSerializer


class SearchAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()
        if not query:
            return response.Response({"query": "", "results": {"lectures": [], "practicals": [], "books": []}})

        lectures = Lecture.objects.filter(title__icontains=query)
        practicals = Practical.objects.filter(title__icontains=query)
        books = Book.objects.filter(Q(title__icontains=query) | Q(author__icontains=query))

        return response.Response(
            {
                "query": query,
                "results": {
                    "lectures": LectureSerializer(lectures, many=True, context={"request": request}).data,
                    "practicals": PracticalSerializer(practicals, many=True, context={"request": request}).data,
                    "books": BookSerializer(books, many=True, context={"request": request}).data,
                },
            }
        )
