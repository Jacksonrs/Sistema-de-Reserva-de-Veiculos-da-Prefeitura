import json
from datetime import date, time
from django.test import TestCase
from rest_framework import status
from veiculos.models import Veiculo
from usuarios.models import Usuario
from usuarios.tests import criar_usuario


class ReservaFlowTest(TestCase):
    def setUp(self):
        self.admin = criar_usuario(username='admin', role='admin')
        self.user = criar_usuario(username='joao')
        self.veiculo = Veiculo.objects.create(
            plate='ABC-1234', model='Hilux', brand='Toyota', year=2022,
            fuel='Diesel', km=10000, capacity=5, vehicle_type='Caminhonete',
            status='disponivel',
        )

        resp = self.client.post('/api/auth/login/', {'username': 'joao', 'password': '12345678'})
        self.user_token = resp.data['access']
        self.user_headers = {'HTTP_AUTHORIZATION': f'Bearer {self.user_token}'}

        resp = self.client.post('/api/auth/login/', {'username': 'admin', 'password': '12345678'})
        self.admin_token = resp.data['access']
        self.admin_headers = {'HTTP_AUTHORIZATION': f'Bearer {self.admin_token}'}

    def _post_json(self, path, data, headers):
        return self.client.post(path, json.dumps(data), content_type='application/json', **headers)

    def _patch_json(self, path, data, headers):
        return self.client.patch(path, json.dumps(data), content_type='application/json', **headers)

    def _criar_reserva(self, headers=None, data_override=None):
        headers = headers or self.user_headers
        data = {
            'veiculo': self.veiculo.id,
            'destination': 'Centro da Cidade',
            'date': '2026-07-15',
            'departure_time': '08:00',
            'return_time': '12:00',
            'sector': 'Infraestrutura',
        }
        if data_override:
            data.update(data_override)
        return self._post_json('/api/reservas/', data, headers)

    # ─── Criação ───────────────────────────────────────────────────────────

    def test_create_reserva(self):
        resp = self._criar_reserva()
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['status'], 'pendente')
        self.assertEqual(resp.data['vehicle_plate'], 'ABC-1234')
        self.assertEqual(resp.data['driver_name'], 'Joao')

    def test_create_reserva_unauthenticated(self):
        resp = self.client.post('/api/reservas/', {'veiculo': self.veiculo.id})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_reserva_vehicle_maintenance(self):
        self.veiculo.status = 'manutencao'
        self.veiculo.save()
        resp = self._criar_reserva()
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_reserva_conflict(self):
        self._criar_reserva()
        resp = self._criar_reserva()
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_reserva_no_conflict_different_date(self):
        self._criar_reserva()
        resp = self._criar_reserva(data_override={'date': '2026-07-16'})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_create_reserva_no_conflict_different_time(self):
        self._criar_reserva()
        resp = self._criar_reserva(data_override={'departure_time': '13:00', 'return_time': '17:00'})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # ─── Listagem ──────────────────────────────────────────────────────────

    def test_user_sees_only_own_reservas(self):
        self._criar_reserva()
        outro = criar_usuario(username='maria')
        resp = self.client.post('/api/auth/login/', {'username': 'maria', 'password': '12345678'})
        token = resp.data['access']
        resp = self.client.get('/api/reservas/', HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(len(resp.data), 0)

    def test_admin_sees_all_reservas(self):
        self._criar_reserva()
        resp = self.client.get('/api/reservas/', **self.admin_headers)
        self.assertGreaterEqual(len(resp.data), 1)

    def test_list_filter_by_status(self):
        self._criar_reserva()
        resp = self.client.get('/api/reservas/?status=pendente', **self.admin_headers)
        self.assertGreaterEqual(len(resp.data), 1)
        resp = self.client.get('/api/reservas/?status=finalizada', **self.admin_headers)
        self.assertEqual(len(resp.data), 0)

    # ─── Cancelar ──────────────────────────────────────────────────────────

    def test_cancel_pendente(self):
        r = self._criar_reserva()
        rid = r.data['id']
        resp = self.client.patch(f'/api/reservas/{rid}/cancelar/', {}, **self.user_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'cancelada')
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'disponivel')

    def test_cancel_other_user_reserva(self):
        r = self._criar_reserva()
        outro = criar_usuario(username='hacker')
        resp = self.client.post('/api/auth/login/', {'username': 'hacker', 'password': '12345678'})
        token = resp.data['access']
        resp = self.client.patch(f'/api/reservas/{r.data["id"]}/cancelar/', {},
                                 HTTP_AUTHORIZATION=f'Bearer {token}')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_cancel_approved_by_admin(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        resp = self.client.patch(f'/api/reservas/{rid}/cancelar/', {}, **self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'cancelada')

    def test_cancel_finalizada_fails(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'finalizar', 'km': 42.5}, self.admin_headers)
        resp = self.client.patch(f'/api/reservas/{rid}/cancelar/', {}, **self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # ─── Aprovar ───────────────────────────────────────────────────────────

    def test_approve_reserva(self):
        r = self._criar_reserva()
        rid = r.data['id']
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'aprovar'}, self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'reservado')
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'em-uso')
        self.assertEqual(self.veiculo.current_driver, 'Joao')

    def test_approve_non_admin_fails(self):
        r = self._criar_reserva()
        rid = r.data['id']
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'aprovar'}, self.user_headers)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_approve_maintenance_vehicle_fails(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self.veiculo.status = 'manutencao'
        self.veiculo.save()
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'aprovar'}, self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_approve_conflict_with_existing(self):
        r1 = self._criar_reserva()
        self._patch_json(f'/api/reservas/{r1.data["id"]}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        r2 = self._criar_reserva(data_override={'date': '2026-07-15'})
        self.assertEqual(r2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_approve_already_approved_fails(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'aprovar'}, self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # ─── Recusar ───────────────────────────────────────────────────────────

    def test_refuse_reserva(self):
        r = self._criar_reserva()
        rid = r.data['id']
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'recusar', 'admin_note': 'Veículo indisponível'},
                                self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'recusada')
        self.assertEqual(resp.data['admin_note'], 'Veículo indisponível')

    def test_refuse_approved_reserva_frees_vehicle(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'recusar'}, self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'disponivel')

    # ─── Finalizar ─────────────────────────────────────────────────────────

    def test_finalize_reserva(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'finalizar', 'km': 42.5},
                                self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['status'], 'finalizada')
        self.assertEqual(float(resp.data['km']), 42.5)
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'disponivel')

    def test_finalize_pendente_fails(self):
        r = self._criar_reserva()
        rid = r.data['id']
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'finalizar', 'km': 10},
                                self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_finalize_sem_km(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        resp = self._patch_json(f'/api/reservas/{rid}/acao/',
                                {'action': 'finalizar'},
                                self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsNone(resp.data['km'])

    # ─── Stats ─────────────────────────────────────────────────────────────

    def test_dashboard_stats(self):
        self._criar_reserva()
        resp = self.client.get('/api/reservas/stats/', **self.admin_headers)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('reservas_pendentes', resp.data)
        self.assertIn('total_veiculos', resp.data)

    def test_dashboard_stats_non_admin(self):
        resp = self.client.get('/api/reservas/stats/', **self.user_headers)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # ─── Sincronização veículo ─────────────────────────────────────────────

    def test_vehicle_freed_on_refuse_approved(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'em-uso')
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'recusar'}, self.admin_headers)
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'disponivel')
        self.assertIsNone(self.veiculo.current_driver)

    def test_vehicle_freed_on_finalize(self):
        r = self._criar_reserva()
        rid = r.data['id']
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'aprovar'}, self.admin_headers)
        self._patch_json(f'/api/reservas/{rid}/acao/',
                         {'action': 'finalizar', 'km': 30},
                         self.admin_headers)
        self.veiculo.refresh_from_db()
        self.assertEqual(self.veiculo.status, 'disponivel')
        self.assertIsNone(self.veiculo.current_destination)
