from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from apps.books.models import Book
from apps.books.serializers import BookSerializer
from utils.permissions import IsAdminOrReadOnly


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title", "author"]
    ordering_fields = ["title", "uploaded_at"]
