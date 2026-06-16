import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Usuario


def criar_usuario(username='teste', password='12345678', role='usuario', active=True):
    user = Usuario.objects.create_user(
        username=username, email=f'{username}@teste.com',
        name=username.title(), initials=username[:2].upper(),
        sector='Teste', role=role, password=password,
    )
    if not active:
        user.active = False
        user.save(update_fields=['active'])
    return user


class AuthTest(TestCase):
    def setUp(self):
        self.admin = criar_usuario(username='admin', role='admin')
        self.user = criar_usuario(username='joao')

    def test_login_success(self):
        resp = self.client.post('/api/auth/login/', {'username': 'joao', 'password': '12345678'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)
        self.assertEqual(resp.data['user']['name'], 'Joao')

    def test_login_inactive_user(self):
        criar_usuario(username='inativo', active=False)
        resp = self.client.post('/api/auth/login/', {'username': 'inativo', 'password': '12345678'})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_password(self):
        resp = self.client.post('/api/auth/login/', {'username': 'joao', 'password': 'errada'})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_authenticated(self):
        token = self._get_token('joao')
        resp = self.client.get('/api/auth/me/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['username'], 'joao')

    def test_me_unauthenticated(self):
        resp = self.client.get('/api/auth/me/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def _get_token(self, username):
        resp = self.client.post('/api/auth/login/', {'username': username, 'password': '12345678'})
        return resp.data['access']


class UsuarioCRUDTest(TestCase):
    def setUp(self):
        admin = criar_usuario(username='admin', role='admin')
        resp = self.client.post('/api/auth/login/', {'username': 'admin', 'password': '12345678'})
        self.token = resp.data['access']
        self.headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

    def test_list_usuarios(self):
        criar_usuario(username='joao')
        criar_usuario(username='maria')
        resp = self.client.get('/api/usuarios/', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(resp.data), 3)

    def test_create_usuario(self):
        payload = {
            'username': 'novo', 'name': 'Novo Usuario', 'initials': 'NU',
            'email': 'novo@teste.com', 'sector': 'Infra', 'role': 'usuario',
            'active': True, 'password': 'senha@123',
        }
        resp = self.client.post('/api/usuarios/', payload, **self.headers, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['name'], 'Novo Usuario')

    def test_create_usuario_non_admin(self):
        user = criar_usuario(username='comum')
        resp = self.client.post('/api/auth/login/', {'username': 'comum', 'password': '12345678'})
        token = resp.data['access']
        payload = {'username': 'hacker', 'name': 'Hacker', 'initials': 'XX',
                   'email': 'h@cker.com', 'sector': 'TI', 'role': 'admin', 'active': True}
        resp = self.client.post('/api/usuarios/', payload,
                                HTTP_AUTHORIZATION=f'Bearer {token}', format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_usuario(self):
        user = criar_usuario(username='alvo')
        payload = {'name': 'Nome Alterado', 'email': 'alterado@teste.com',
                   'sector': 'RH', 'role': 'usuario', 'initials': 'NA', 'active': True}
        resp = self.client.patch(
            f'/api/usuarios/{user.id}/',
            data=json.dumps(payload),
            content_type='application/json',
            **self.headers,
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['name'], 'Nome Alterado')

    def test_delete_usuario(self):
        user = criar_usuario(username='excluir')
        resp = self.client.delete(f'/api/usuarios/{user.id}/', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Usuario.objects.filter(pk=user.pk).exists())

    def test_toggle_ativo(self):
        user = criar_usuario(username='toggleuser')
        self.assertTrue(Usuario.objects.get(pk=user.pk).active)
        resp = self.client.patch(f'/api/usuarios/{user.id}/toggle-ativo/', {}, **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(Usuario.objects.get(pk=user.pk).active)

    def test_non_admin_cannot_list_users(self):
        user = criar_usuario(username='comum2')
        resp = self.client.post('/api/auth/login/', {'username': 'comum2', 'password': '12345678'})
        token = resp.data['access']
        resp = self.client.get('/api/usuarios/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
