from django.db import models
from django.conf import settings


class Reserva(models.Model):
    STATUS_CHOICES = [
        ('pendente',   'Pendente'),
        ('reservado',  'Reservado'),
        ('em-uso',     'Em uso'),
        ('finalizada', 'Finalizada'),
        ('cancelada',  'Cancelada'),
        ('recusada',   'Recusada'),
    ]

    # Relacionamentos
    veiculo     = models.ForeignKey(
        'veiculos.Veiculo',
        on_delete=models.PROTECT,
        related_name='reservas',
        verbose_name='Veículo',
    )
    driver      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='reservas',
        verbose_name='Solicitante',
    )

    # Campos desnormalizados (espelham o front para facilitar listagens)
    vehicle_plate   = models.CharField('Placa', max_length=10)
    vehicle_label   = models.CharField('Rótulo do veículo', max_length=200)
    driver_name     = models.CharField('Nome do solicitante', max_length=150)
    driver_initials = models.CharField('Iniciais', max_length=4)
    sector          = models.CharField('Setor', max_length=100)

    # Dados da viagem
    destination     = models.CharField('Destino', max_length=255)
    date            = models.DateField('Data')
    departure_time  = models.TimeField('Hora de saída')
    return_time     = models.TimeField('Hora de retorno')
    km              = models.DecimalField('KM percorrido', max_digits=8, decimal_places=1,
                                          null=True, blank=True)

    # Status e nota do admin
    status          = models.CharField('Status', max_length=15, choices=STATUS_CHOICES,
                                       default='pendente')
    admin_note      = models.TextField('Observação do admin', blank=True, null=True)

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name        = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering            = ['-created_at']

    def __str__(self):
        return f'{self.vehicle_plate} → {self.destination} [{self.date}] ({self.status})'

    def save(self, *args, **kwargs):
        """Preenche campos desnormalizados automaticamente."""
        if self.veiculo_id and not self.vehicle_plate:
            v = self.veiculo
            self.vehicle_plate = v.plate
            self.vehicle_label = f'{v.plate} — {v.brand} {v.model}'
        if self.driver_id and not self.driver_name:
            u = self.driver
            self.driver_name     = u.name
            self.driver_initials = u.initials
            self.sector          = self.sector or u.sector
        super().save(*args, **kwargs)
