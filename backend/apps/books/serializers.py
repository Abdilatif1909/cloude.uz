from rest_framework import serializers

from apps.books.models import Book


class BookSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "author", "source_path", "file_hash", "file", "file_name", "file_url", "pdf_url", "download_url", "image", "image_url", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at", "file_url", "pdf_url", "download_url", "file_name", "image_url", "file_hash"]
        extra_kwargs = {"file": {"required": False, "allow_null": True}}

    def get_file_url(self, obj):
        return obj.pdf_url or (obj.file.url if obj.file else None)

    def get_pdf_url(self, obj):
        return obj.pdf_url

    def get_download_url(self, obj):
        return obj.download_url

    def get_file_name(self, obj):
        return obj.file_name

    def get_image_url(self, obj):
        request = self.context.get("request")
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url if obj.image else None
