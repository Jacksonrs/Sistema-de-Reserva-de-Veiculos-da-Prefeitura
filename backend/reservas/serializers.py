from datetime import date, time
from django.db.models import Q
from rest_framework import serializers
from .models import Reserva


class ReservaSerializer(serializers.ModelSerializer):
    """Serializer completo — usado em listagens e detalhes."""
    class Meta:
        model  = Reserva
        fields = [
            'id', 'veiculo', 'driver',
            'vehicle_plate', 'vehicle_label',
            'driver_name', 'driver_initials', 'sector',
            'destination', 'date', 'departure_time', 'return_time', 'km',
            'status', 'admin_note',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'vehicle_plate', 'vehicle_label',
            'driver_name', 'driver_initials',
            'created_at', 'updated_at',
        ]


class ReservaCreateSerializer(serializers.ModelSerializer):
    """Criação de reserva pelo usuário — status inicial sempre 'pendente'."""
    class Meta:
        model  = Reserva
        fields = ['veiculo', 'destination', 'date', 'departure_time', 'return_time', 'sector']

    def validate(self, data):
        veiculo = data.get('veiculo')
        if veiculo and veiculo.status == 'manutencao':
            raise serializers.ValidationError(
                {'veiculo': 'Este veículo está em manutenção e não pode ser reservado.'}
            )

        if veiculo and data.get('date') and data.get('departure_time') and data.get('return_time'):
            conflitos = Reserva.objects.filter(
                veiculo=veiculo,
                date=data['date'],
                status__in=['pendente', 'reservado', 'em-uso'],
            ).filter(
                Q(departure_time__lt=data['return_time'],
                  return_time__gt=data['departure_time'])
            )
            if conflitos.exists():
                raise serializers.ValidationError(
                    {'veiculo': 'Este veículo já possui reserva neste horário.'}
                )

        return data

    def create(self, validated_data):
        request = self.context['request']
        user    = request.user
        veiculo = validated_data['veiculo']

        reserva = Reserva(
            veiculo          = veiculo,
            driver           = user,
            vehicle_plate    = veiculo.plate,
            vehicle_label    = f'{veiculo.plate} — {veiculo.brand} {veiculo.model}',
            driver_name      = user.name,
            driver_initials  = user.initials,
            sector           = validated_data.get('sector') or user.sector,
            destination      = validated_data['destination'],
            date             = validated_data['date'],
            departure_time   = validated_data['departure_time'],
            return_time      = validated_data['return_time'],
            status           = 'pendente',
        )
        reserva.save()
        return reserva


class ReservaAdminActionSerializer(serializers.Serializer):
    """Aprovação / recusa pelo admin."""
    action     = serializers.ChoiceField(choices=['aprovar', 'recusar', 'finalizar'])
    admin_note = serializers.CharField(required=False, allow_blank=True)
    km         = serializers.DecimalField(max_digits=8, decimal_places=1, required=False)
