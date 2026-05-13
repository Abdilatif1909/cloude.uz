from django.conf import settings
from rest_framework import generics, permissions, response, views

from apps.common.models import ContactMessage
from apps.common.serializers import AboutSerializer, ContactMessageSerializer


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]


class AboutAPIView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = AboutSerializer(
            {
                "name": settings.APP_METADATA["name"],
                "description": settings.APP_METADATA["description"],
                "contact_email": settings.APP_METADATA["contact_email"],
                "features": [
                    "Lecture and practical PDF library",
                    "Teacher and admin analytics panels",
                    "Search across resources, tests, and books",
                    "Modern responsive frontend experience",
                ],
            }
        )
        return response.Response(serializer.data)
