from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'ADMIN'

class IsRoleMatching(BasePermission):
    def has_permission(self, request, view):
        # Obtener role de la URL y comparar con mayúsculas
        url_role = view.kwargs.get('role', '').upper()
        return request.user.role == url_role
    
    def has_object_permission(self, request, view, obj):
        # Permiso adicional para dueños de recursos
        if hasattr(obj, 'paciente'):
            return obj.paciente == request.user
        if hasattr(obj, 'doctor'):
            return obj.doctor == request.user
        return False

class IsDoctorPropio(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.doctor == request.user