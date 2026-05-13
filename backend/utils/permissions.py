from rest_framework.permissions import SAFE_METHODS, BasePermission

from utils.constants import ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == ROLE_ADMIN)


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == ROLE_TEACHER)


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == ROLE_STUDENT)


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or (
            request.user and request.user.is_authenticated and request.user.role == ROLE_ADMIN
        )


class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {ROLE_TEACHER, ROLE_ADMIN}
        )


class IsTeacherOrAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in {ROLE_TEACHER, ROLE_ADMIN}
        )
