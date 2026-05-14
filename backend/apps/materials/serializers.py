from rest_framework import serializers

from apps.materials.models import Lecture, Practical


class BaseMaterialSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    pdf_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()

    def get_file_url(self, obj):
        return obj.pdf_url or (obj.file.url if obj.file else None)

    def get_pdf_url(self, obj):
        return obj.pdf_url

    def get_download_url(self, obj):
        return obj.download_url

    def get_file_name(self, obj):
        return obj.file_name


class LectureSerializer(BaseMaterialSerializer):
    class Meta:
        model = Lecture
        fields = ["id", "title", "source_path", "file_hash", "file", "file_name", "file_url", "pdf_url", "download_url", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at", "file_url", "pdf_url", "download_url", "file_name", "file_hash"]
        extra_kwargs = {"file": {"required": False, "allow_null": True}}


class PracticalSerializer(BaseMaterialSerializer):
    class Meta:
        model = Practical
        fields = ["id", "title", "source_path", "file_hash", "file", "file_name", "file_url", "pdf_url", "download_url", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at", "file_url", "pdf_url", "download_url", "file_name", "file_hash"]
        extra_kwargs = {"file": {"required": False, "allow_null": True}}
