from django.conf import settings
from rest_framework import serializers

from apps.common.models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "full_name", "email", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class AboutSerializer(serializers.Serializer):
    name = serializers.CharField(default=settings.APP_METADATA["name"])
    description = serializers.CharField(default=settings.APP_METADATA["description"])
    contact_email = serializers.EmailField(default=settings.APP_METADATA["contact_email"])
    features = serializers.ListField(
        child=serializers.CharField(),
        default=[
            "JWT authentication",
            "PDF learning resources",
            "Role-based dashboards",
            "Online tests and analytics",
        ],
    )
