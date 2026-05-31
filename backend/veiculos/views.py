from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Veiculo
from .serializers import VeiculoSerializer, VeiculoStatusSerializer
from usuarios.permissions import IsAdmin


class VeiculoListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/veiculos/       →  lista todos         (autenticado)
    POST /api/veiculos/       →  cadastra novo       (admin)
    """
    queryset           = Veiculo.objects.all()
    serializer_class   = VeiculoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Veiculo.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        # Apenas admin pode criar
        if not self.request.user.is_admin:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Apenas administradores podem cadastrar veículos.')
        serializer.save()


class VeiculoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/veiculos/<id>/   →  detalhe     (autenticado)
    PATCH  /api/veiculos/<id>/   →  atualiza    (admin)
    DELETE /api/veiculos/<id>/   →  remove      (admin)
    """
    queryset           = Veiculo.objects.all()
    serializer_class   = VeiculoSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if not request.user.is_admin:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Apenas administradores podem editar veículos.')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_admin:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Apenas administradores podem remover veículos.')
        return super().destroy(request, *args, **kwargs)


class VeiculoStatusView(APIView):
    """PATCH /api/veiculos/<id>/status/  →  atualiza status (admin)"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            veiculo = Veiculo.objects.get(pk=pk)
        except Veiculo.DoesNotExist:
            return Response({'detail': 'Veículo não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = VeiculoStatusSerializer(veiculo, data=request.data, partial=True)
        if serializer.is_valid():
            # Limpa campos de uso se status voltou a 'disponivel' ou 'manutencao'
            novo_status = serializer.validated_data.get('status', veiculo.status)
            if novo_status in ('disponivel', 'manutencao'):
                serializer.validated_data.update({
                    'current_driver': None,
                    'current_driver_initials': None,
                    'current_destination': None,
                    'departure_time': None,
                })
            serializer.save()
            return Response(VeiculoSerializer(veiculo).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
