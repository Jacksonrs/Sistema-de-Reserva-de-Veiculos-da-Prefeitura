from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Apenas usuários com role='admin' podem acessar."""
    message = 'Apenas administradores podem realizar esta ação.'

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )


class IsOwnerOrAdmin(BasePermission):
    """Admin acessa tudo; usuário comum acessa apenas seus próprios recursos."""

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        # Suporte para Reserva (driver_id) e Usuario (pk)
        driver_id = getattr(obj, 'driver_id', None)
        if driver_id:
            return driver_id == request.user.id
        return obj == request.user
