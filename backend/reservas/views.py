from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Reserva
from .serializers import ReservaSerializer, ReservaCreateSerializer, ReservaAdminActionSerializer
from usuarios.permissions import IsAdmin


# ─── Listagem e criação ────────────────────────────────────────────────────────
class ReservaListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reservas/    →  admin vê todas; usuário vê as suas
    POST /api/reservas/    →  cria solicitação (qualquer usuário autenticado)
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs   = Reserva.objects.select_related('veiculo', 'driver').all()

        # Usuário comum vê apenas suas reservas
        if user.role != 'admin':
            qs = qs.filter(driver=user)

        # Filtros opcionais via query params
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        data_filter = self.request.query_params.get('date')
        if data_filter:
            qs = qs.filter(date=data_filter)

        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReservaCreateSerializer
        return ReservaSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reserva = serializer.save()
        output  = ReservaSerializer(reserva)
        return Response(output.data, status=status.HTTP_201_CREATED)


# ─── Detalhe ──────────────────────────────────────────────────────────────────
class ReservaDetailView(generics.RetrieveAPIView):
    """GET /api/reservas/<id>/"""
    queryset           = Reserva.objects.all()
    serializer_class   = ReservaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs   = Reserva.objects.all()
        if user.role != 'admin':
            qs = qs.filter(driver=user)
        return qs


# ─── Cancelar (usuário ou admin) ─────────────────────────────────────────────
class CancelarReservaView(APIView):
    """PATCH /api/reservas/<id>/cancelar/"""
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            return Response({'detail': 'Reserva não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        # Apenas dono ou admin pode cancelar
        if request.user.role != 'admin' and reserva.driver != request.user:
            return Response({'detail': 'Sem permissão.'}, status=status.HTTP_403_FORBIDDEN)

        if reserva.status not in ('pendente', 'reservado'):
            return Response(
                {'detail': 'Apenas reservas pendentes ou aprovadas podem ser canceladas.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reserva.status = 'cancelada'
        reserva.save()

        veiculo = reserva.veiculo
        veiculo.status = 'disponivel'
        veiculo.current_driver = None
        veiculo.current_driver_initials = None
        veiculo.current_destination = None
        veiculo.departure_time = None
        veiculo.save()

        return Response(ReservaSerializer(reserva).data)


# ─── Ações do admin ───────────────────────────────────────────────────────────
class AcaoAdminReservaView(APIView):
    """
    PATCH /api/reservas/<id>/acao/
    Body: { "action": "aprovar" | "recusar" | "finalizar", "admin_note": "...", "km": 42.5 }
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        try:
            reserva = Reserva.objects.get(pk=pk)
        except Reserva.DoesNotExist:
            return Response({'detail': 'Reserva não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReservaAdminActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action     = serializer.validated_data['action']
        admin_note = serializer.validated_data.get('admin_note', '')
        km         = serializer.validated_data.get('km')

        veiculo = reserva.veiculo

        if action == 'aprovar':
            if reserva.status != 'pendente':
                return Response({'detail': 'Apenas reservas pendentes podem ser aprovadas.'},
                                status=status.HTTP_400_BAD_REQUEST)
            if veiculo.status == 'manutencao':
                return Response({'detail': 'Este veículo está em manutenção.'},
                                status=status.HTTP_400_BAD_REQUEST)
            conflitos = Reserva.objects.filter(
                veiculo=veiculo, date=reserva.date,
                status__in=['reservado', 'em-uso'],
            ).filter(
                departure_time__lt=reserva.return_time,
                return_time__gt=reserva.departure_time,
            ).exclude(pk=reserva.pk)
            if conflitos.exists():
                return Response({'detail': 'Já existe outra reserva para este horário.'},
                                status=status.HTTP_400_BAD_REQUEST)
            reserva.status = 'reservado'
            veiculo.status = 'em-uso'
            veiculo.current_driver = reserva.driver_name
            veiculo.current_driver_initials = reserva.driver_initials
            veiculo.current_destination = reserva.destination
            veiculo.departure_time = reserva.departure_time

        elif action == 'recusar':
            if reserva.status not in ('pendente', 'reservado'):
                return Response({'detail': 'Apenas reservas pendentes ou aprovadas podem ser recusadas.'},
                                status=status.HTTP_400_BAD_REQUEST)
            estava_reservado = reserva.status == 'reservado'
            reserva.status     = 'recusada'
            reserva.admin_note = admin_note
            if estava_reservado:
                veiculo.status = 'disponivel'
                veiculo.current_driver = None
                veiculo.current_driver_initials = None
                veiculo.current_destination = None
                veiculo.departure_time = None

        elif action == 'finalizar':
            if reserva.status not in ('reservado', 'em-uso'):
                return Response({'detail': 'Apenas reservas em andamento podem ser finalizadas.'},
                                status=status.HTTP_400_BAD_REQUEST)
            reserva.status = 'finalizada'
            if km is not None:
                reserva.km = km
            veiculo.status = 'disponivel'
            veiculo.current_driver = None
            veiculo.current_driver_initials = None
            veiculo.current_destination = None
            veiculo.departure_time = None

        reserva.save()
        veiculo.save()
        return Response(ReservaSerializer(reserva).data)


# ─── Dashboard stats (admin) ─────────────────────────────────────────────────
class DashboardStatsView(APIView):
    """GET /api/reservas/stats/  →  contadores para o dashboard admin"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        from veiculos.models import Veiculo
        from usuarios.models import Usuario

        stats = {
            'total_veiculos':       Veiculo.objects.count(),
            'veiculos_disponiveis': Veiculo.objects.filter(status='disponivel').count(),
            'veiculos_em_uso':      Veiculo.objects.filter(status='em-uso').count(),
            'veiculos_manutencao':  Veiculo.objects.filter(status='manutencao').count(),
            'reservas_pendentes':   Reserva.objects.filter(status='pendente').count(),
            'reservas_hoje':        Reserva.objects.filter(
                                        date=__import__('datetime').date.today()
                                    ).count(),
            'total_usuarios':       Usuario.objects.filter(active=True).count(),
        }
        return Response(stats)
