from django.contrib import admin
from .models import Reserva


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display  = ('id', 'vehicle_plate', 'vehicle_label', 'driver_name',
                      'sector', 'destination', 'date', 'status')
    list_filter   = ('status', 'date', 'sector')
    search_fields = ('vehicle_plate', 'driver_name', 'destination', 'sector')
    ordering      = ('-created_at',)
    readonly_fields = ('vehicle_plate', 'vehicle_label', 'driver_name',
                       'driver_initials', 'created_at', 'updated_at')

    fieldsets = (
        ('Veículo',  {'fields': ('veiculo', 'vehicle_plate', 'vehicle_label')}),
        ('Solicitante', {'fields': ('driver', 'driver_name', 'driver_initials', 'sector')}),
        ('Viagem',   {'fields': ('destination', 'date', 'departure_time', 'return_time', 'km')}),
        ('Status',   {'fields': ('status', 'admin_note')}),
        ('Datas',    {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
