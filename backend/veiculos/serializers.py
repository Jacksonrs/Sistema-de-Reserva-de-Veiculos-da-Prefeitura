from rest_framework import serializers
from .models import Veiculo


class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Veiculo
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_plate(self, value):
        return value.upper().strip()


class VeiculoStatusSerializer(serializers.ModelSerializer):
    """Atualização rápida só do status + campos de uso."""
    class Meta:
        model  = Veiculo
        fields = [
            'status',
            'current_driver', 'current_driver_initials',
            'current_destination', 'departure_time',
        ]
