from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Usuario
from .serializers import (
    CustomTokenObtainPairSerializer,
    UsuarioSerializer,
    UsuarioCreateSerializer,
    UsuarioUpdateSerializer,
)
from .permissions import IsAdmin


# ─── Auth ─────────────────────────────────────────────────────────────────────
class LoginView(TokenObtainPairView):
    """POST /api/auth/login/  →  { access, refresh, user }"""
    permission_classes   = [AllowAny]
    serializer_class     = CustomTokenObtainPairSerializer


class MeView(APIView):
    """GET /api/auth/me/  →  dados do usuário autenticado."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user, context={'request': request})
        return Response(serializer.data)


# ─── CRUD de usuários (admin) ─────────────────────────────────────────────────
class UsuarioListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/usuarios/          →  lista todos  (admin)
    POST /api/usuarios/          →  cria novo    (admin)
    """
    queryset           = Usuario.objects.all().order_by('name')
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UsuarioCreateSerializer
        return UsuarioSerializer

    def get_serializer_context(self):
        return {'request': self.request}


class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/usuarios/<id>/   →  detalhe      (admin)
    PATCH  /api/usuarios/<id>/   →  atualiza     (admin)
    DELETE /api/usuarios/<id>/   →  remove       (admin)
    """
    queryset           = Usuario.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UsuarioUpdateSerializer
        return UsuarioSerializer

    def get_serializer_context(self):
        return {'request': self.request}


class ToggleUsuarioAtivoView(APIView):
    """PATCH /api/usuarios/<id>/toggle-ativo/  →  ativa/desativa usuário (admin)"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            usuario = Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            return Response({'detail': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        usuario.active = not usuario.active
        usuario.save()
        return Response({'active': usuario.active})
