from django.urls import path
from .views import (
    ReservaListCreateView,
    ReservaDetailView,
    CancelarReservaView,
    AcaoAdminReservaView,
    DashboardStatsView,
)

urlpatterns = [
    path('',               ReservaListCreateView.as_view(), name='reserva-list-create'),
    path('stats/',         DashboardStatsView.as_view(),    name='reserva-stats'),
    path('<int:pk>/',      ReservaDetailView.as_view(),     name='reserva-detail'),
    path('<int:pk>/cancelar/', CancelarReservaView.as_view(),    name='reserva-cancelar'),
    path('<int:pk>/acao/',     AcaoAdminReservaView.as_view(),   name='reserva-acao-admin'),
]
