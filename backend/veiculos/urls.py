from django.urls import path
from .views import VeiculoListCreateView, VeiculoDetailView, VeiculoStatusView

urlpatterns = [
    path('',              VeiculoListCreateView.as_view(), name='veiculo-list-create'),
    path('<int:pk>/',     VeiculoDetailView.as_view(),     name='veiculo-detail'),
    path('<int:pk>/status/', VeiculoStatusView.as_view(),  name='veiculo-status'),
]
