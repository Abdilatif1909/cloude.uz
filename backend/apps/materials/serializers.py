from rest_framework import serializers

from apps.materials.models import Lecture, Practical


class BaseMaterialSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    def get_file_url(self, obj):
        request = self.context.get("request")
        if request and obj.file:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None


class LectureSerializer(BaseMaterialSerializer):
    class Meta:
        model = Lecture
        fields = ["id", "title", "file", "file_url", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at", "file_url"]


class PracticalSerializer(BaseMaterialSerializer):
    class Meta:
        model = Practical
        fields = ["id", "title", "file", "file_url", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at", "file_url"]
