import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Veiculo
from usuarios.tests import criar_usuario


class VeiculoTest(TestCase):
    def setUp(self):
        admin = criar_usuario(username='admin', role='admin')
        resp = self.client.post('/api/auth/login/', {'username': 'admin', 'password': '12345678'})
        self.token = resp.data['access']
        self.headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

    def _criar_veiculo(self, plate='ABC-1234'):
        return Veiculo.objects.create(
            plate=plate, model='Hilux', brand='Toyota', year=2022,
            fuel='Diesel', km=10000, capacity=5, vehicle_type='Caminhonete',
            status='disponivel',
        )

    def test_list_veiculos(self):
        self._criar_veiculo()
        self._criar_veiculo('DEF-5678')
        resp = self.client.get('/api/veiculos/', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 2)

    def test_list_filter_by_status(self):
        self._criar_veiculo()
        v2 = self._criar_veiculo('DEF-5678')
        v2.status = 'em-uso'
        v2.save()
        resp = self.client.get('/api/veiculos/?status=em-uso', **self.headers)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['plate'], 'DEF-5678')

    def test_create_veiculo(self):
        payload = {
            'plate': 'XYZ-9999', 'model': 'Onix', 'brand': 'Chevrolet',
            'year': 2023, 'fuel': 'Flex', 'km': 500, 'capacity': 5,
            'vehicle_type': 'Carro', 'status': 'disponivel',
        }
        resp = self.client.post('/api/veiculos/', payload, **self.headers, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['plate'], 'XYZ-9999')

    def test_create_veiculo_non_admin(self):
        user = criar_usuario(username='comum')
        resp = self.client.post('/api/auth/login/', {'username': 'comum', 'password': '12345678'})
        token = resp.data['access']
        payload = {'plate': 'ZZZ-0000', 'model': 'Teste', 'brand': 'Teste',
                   'year': 2020, 'fuel': 'Flex', 'km': 0, 'capacity': 2,
                   'vehicle_type': 'Carro', 'status': 'disponivel'}
        resp = self.client.post('/api/veiculos/', payload,
                                HTTP_AUTHORIZATION=f'Bearer {token}', format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_veiculo(self):
        v = self._criar_veiculo()
        resp = self.client.patch(f'/api/veiculos/{v.id}/',
                                 json.dumps({'model': 'Corolla'}),
                                 content_type='application/json', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['model'], 'Corolla')

    def test_delete_veiculo(self):
        v = self._criar_veiculo()
        resp = self.client.delete(f'/api/veiculos/{v.id}/', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Veiculo.objects.filter(pk=v.pk).exists())

    def test_update_status(self):
        v = self._criar_veiculo()
        resp = self.client.patch(f'/api/veiculos/{v.id}/status/',
                                 json.dumps({'status': 'manutencao'}),
                                 content_type='application/json', **self.headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'manutencao')

    def test_duplicate_plate(self):
        self._criar_veiculo('ABC-1234')
        payload = {
            'plate': 'ABC-1234', 'model': 'Outro', 'brand': 'Outro',
            'year': 2020, 'fuel': 'Flex', 'km': 0, 'capacity': 5,
            'vehicle_type': 'Carro', 'status': 'disponivel',
        }
        resp = self.client.post('/api/veiculos/', payload, **self.headers, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_admin_can_list(self):
        user = criar_usuario(username='comum2')
        resp = self.client.post('/api/auth/login/', {'username': 'comum2', 'password': '12345678'})
        token = resp.data['access']
        resp = self.client.get('/api/veiculos/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
