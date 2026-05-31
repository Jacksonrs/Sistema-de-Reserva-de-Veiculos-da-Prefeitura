from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UsuarioManager(BaseUserManager):
    """Manager para o modelo de usuário customizado."""

    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O e-mail é obrigatório.')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('active', True)
        extra_fields.setdefault('sector', 'TI')
        return self.create_user(username, email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """
    Usuário do sistema de reservas.
    Roles: 'admin' (gestão completa) | 'usuario' (solicita reservas).
    """

    ROLE_CHOICES = [
        ('admin',   'Administrador'),
        ('usuario', 'Usuário'),
    ]

    username    = models.CharField('Login', max_length=50, unique=True)
    name        = models.CharField('Nome completo', max_length=150)
    initials    = models.CharField('Iniciais', max_length=4)
    email       = models.EmailField('E-mail', unique=True)
    role        = models.CharField('Perfil', max_length=10, choices=ROLE_CHOICES, default='usuario')
    sector      = models.CharField('Setor', max_length=100)
    avatar      = models.ImageField('Avatar', upload_to='avatars/', null=True, blank=True)
    active      = models.BooleanField('Ativo', default=True)

    # Campos exigidos pelo Django admin / PermissionsMixin
    is_staff    = models.BooleanField(default=False)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects = UsuarioManager()

    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['email', 'name', 'sector']

    class Meta:
        verbose_name        = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering            = ['name']

    def __str__(self):
        return f'{self.name} ({self.username})'

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_active(self):
        """Django usa is_active para autenticação — reflete o campo 'active'."""
        return self.active

    @is_active.setter
    def is_active(self, value):
        self.active = value
