from django.db import models
from django.conf import settings


class Veiculo(models.Model):
    STATUS_CHOICES = [
        ('disponivel', 'Disponível'),
        ('em-uso',     'Em uso'),
        ('manutencao', 'Em manutenção'),
    ]

    plate       = models.CharField('Placa',       max_length=10,  unique=True)
    model       = models.CharField('Modelo',      max_length=100)
    brand       = models.CharField('Marca',       max_length=100)
    year        = models.PositiveIntegerField('Ano')
    fuel        = models.CharField('Combustível', max_length=50)
    km          = models.PositiveIntegerField('Quilometragem atual', default=0)
    capacity    = models.PositiveSmallIntegerField('Capacidade (pessoas)')
    type        = models.CharField('Tipo', max_length=50)
    status      = models.CharField('Status', max_length=15, choices=STATUS_CHOICES, default='disponivel')

    # Campos de uso ativo — preenchidos quando status='em-uso'
    current_driver            = models.CharField('Motorista atual', max_length=150, blank=True, null=True)
    current_driver_initials   = models.CharField('Iniciais motorista', max_length=4, blank=True, null=True)
    current_destination       = models.CharField('Destino atual', max_length=255, blank=True, null=True)
    departure_time            = models.TimeField('Hora saída', blank=True, null=True)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Veículo'
        verbose_name_plural = 'Veículos'
        ordering            = ['brand', 'model']

    def __str__(self):
        return f'{self.plate} — {self.brand} {self.model} ({self.year})'
