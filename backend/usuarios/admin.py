from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display  = ('username', 'name', 'email', 'role', 'sector', 'active')
    list_filter   = ('role', 'active', 'sector')
    search_fields = ('username', 'name', 'email')
    ordering      = ('name',)

    fieldsets = (
        (None,            {'fields': ('username', 'password')}),
        ('Dados pessoais', {'fields': ('name', 'initials', 'email', 'avatar')}),
        ('Prefeitura',    {'fields': ('role', 'sector', 'active')}),
        ('Permissões',    {'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'name', 'initials', 'email', 'role', 'sector', 'password1', 'password2'),
        }),
    )
