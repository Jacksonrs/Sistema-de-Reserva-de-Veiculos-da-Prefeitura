from django.urls import path
from .views import UsuarioListCreateView, UsuarioDetailView, ToggleUsuarioAtivoView

urlpatterns = [
    path('',                      UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('<int:pk>/',             UsuarioDetailView.as_view(),     name='usuario-detail'),
    path('<int:pk>/toggle-ativo/', ToggleUsuarioAtivoView.as_view(), name='usuario-toggle-ativo'),
]
