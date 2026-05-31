from django.contrib import admin
from .models import Veiculo


@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display  = ('plate', 'brand', 'model', 'year', 'type', 'status', 'km', 'capacity')
    list_filter   = ('status', 'brand', 'type', 'fuel')
    search_fields = ('plate', 'model', 'brand')
    ordering      = ('brand', 'model')

    fieldsets = (
        ('Identificação', {'fields': ('plate', 'brand', 'model', 'year', 'type', 'fuel')}),
        ('Estado',        {'fields': ('status', 'km', 'capacity')}),
        ('Em uso',        {'fields': ('current_driver', 'current_driver_initials',
                                      'current_destination', 'departure_time'),
                           'classes': ('collapse',)}),
    )
