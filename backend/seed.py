"""
Script de seed — popula o banco com os dados iniciais do projeto.

Execute: python seed.py
(com o ambiente virtual ativado e as migrations já rodadas)
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from usuarios.models import Usuario
from veiculos.models import Veiculo
from reservas.models import Reserva

# ─── Usuários ─────────────────────────────────────────────────────────────────
print("Criando usuários...")

USUARIOS = [
    dict(username='jackson', name='Jackson',        initials='J',  email='jackson@prefeitura.gov.br',      role='admin',   sector='TI',             active=True,  is_staff=True,  password='12345678'),
    dict(username='joao',    name='João Silva',      initials='JS', email='joao.silva@prefeitura.gov.br',   role='usuario', sector='Infraestrutura', active=True,  is_staff=False, password='12345678'),
    dict(username='ruan',    name='Ruan Pablo',      initials='R',  email='ruan.pablo@prefeitura.gov.br',   role='usuario', sector='Transportes',    active=True,  is_staff=False, password='12345678'),
    dict(username='paulo',   name='Paulo Oliveira',  initials='PO', email='paulo.oliveira@prefeitura.gov.br',role='usuario',sector='Administração',  active=True,  is_staff=False, password='12345678'),
    dict(username='tania',   name='Tânia Santos',    initials='TS', email='tania.santos@prefeitura.gov.br', role='usuario', sector='Saúde',          active=True,  is_staff=False, password='12345678'),
    dict(username='ana',     name='Ana Lima',         initials='AL', email='ana.lima@prefeitura.gov.br',     role='usuario', sector='Educação',       active=False, is_staff=False, password='12345678'),
    dict(username='carlos',  name='Carlos Mendes',   initials='CM', email='carlos.mendes@prefeitura.gov.br',role='usuario', sector='Obras',          active=True,  is_staff=False, password='12345678'),
]

for u in USUARIOS:
    password = u.pop('password')
    obj, created = Usuario.objects.get_or_create(username=u['username'], defaults=u)
    if created:
        obj.set_password(password)
        obj.save()
        print(f"  ✓ {obj.username}")
    else:
        print(f"  — {obj.username} (já existe)")

# ─── Veículos ─────────────────────────────────────────────────────────────────
print("\nCriando veículos...")

VEICULOS = [
    dict(plate='CLR-3344', model='Hilux',   brand='Toyota',    year=2022, fuel='Diesel 4x4', km=32450,  capacity=5, type='Caminhonete', status='disponivel'),
    dict(plate='RNL-5591', model='Gol',     brand='VW',        year=2019, fuel='Flex',       km=61890,  capacity=5, type='Carro',       status='disponivel'),
    dict(plate='ZXC-1100', model='Strada',  brand='Fiat',      year=2021, fuel='Flex',       km=18220,  capacity=2, type='Caminhonete', status='disponivel'),
    dict(plate='KLD-8823', model='Spin',    brand='Chevrolet', year=2020, fuel='Flex',       km=45100,  capacity=7, type='Minivan',     status='disponivel'),
    dict(plate='PPT-3310', model='Ka',      brand='Ford',      year=2018, fuel='Flex',       km=88340,  capacity=5, type='Carro',       status='disponivel'),
    dict(plate='ALV-7721', model='Creta',   brand='Hyundai',   year=2022, fuel='Flex',       km=22100,  capacity=5, type='SUV',         status='disponivel'),
    dict(plate='FRT-0055', model='Etios',   brand='Toyota',    year=2020, fuel='Flex',       km=54780,  capacity=5, type='Carro',       status='disponivel'),
    dict(plate='GNT-9982', model='Sandero', brand='Renault',   year=2021, fuel='Flex',       km=71230,  capacity=5, type='Carro',       status='disponivel'),
    dict(plate='HSP-1023', model='Argo',    brand='Fiat',      year=2021, fuel='Flex',       km=41230,  capacity=5, type='Carro',       status='em-uso',
         current_driver='Maria Silva', current_driver_initials='MS', current_destination='Secretaria de Saúde', departure_time='08:15'),
    dict(plate='PMN-4471', model='S10',     brand='Chevrolet', year=2020, fuel='Diesel',     km=98110,  capacity=5, type='Caminhonete', status='em-uso',
         current_driver='Roberto Gomes', current_driver_initials='RG', current_destination='Zona Rural — Assentamento', departure_time='07:40'),
    dict(plate='TRP-2209', model='Kombi',   brand='VW',        year=2015, fuel='Flex',       km=134900, capacity=9, type='Van',         status='em-uso',
         current_driver='Ana Lima', current_driver_initials='AL', current_destination='Escola Mun. João XXIII', departure_time='09:00'),
    dict(plate='BRT-0834', model='Duster',  brand='Renault',   year=2021, fuel='Flex',       km=67400,  capacity=5, type='SUV',         status='em-uso',
         current_driver='Felipe Costa', current_driver_initials='FC', current_destination='INSS — reunião', departure_time='09:30'),
    dict(plate='MPA-6677', model='Ranger',  brand='Ford',      year=2019, fuel='Diesel',     km=55900,  capacity=5, type='Caminhonete', status='manutencao'),
]

for v in VEICULOS:
    obj, created = Veiculo.objects.get_or_create(plate=v['plate'], defaults=v)
    if created:
        print(f"  ✓ {obj.plate} — {obj.brand} {obj.model}")
    else:
        print(f"  — {obj.plate} (já existe)")

# ─── Reservas de exemplo ──────────────────────────────────────────────────────
print("\nCriando reservas de exemplo...")

joao  = Usuario.objects.get(username='joao')
paulo = Usuario.objects.get(username='paulo')
tania = Usuario.objects.get(username='tania')
carlos= Usuario.objects.get(username='carlos')

v1  = Veiculo.objects.get(plate='CLR-3344')
v2  = Veiculo.objects.get(plate='RNL-5591')
v3  = Veiculo.objects.get(plate='ZXC-1100')
v4  = Veiculo.objects.get(plate='KLD-8823')
v9  = Veiculo.objects.get(plate='HSP-1023')

RESERVAS = [
    # Pendentes
    dict(veiculo=v1,  driver=joao,  vehicle_plate='CLR-3344', vehicle_label='CLR-3344 — Toyota Hilux',
         driver_name='João Silva',    driver_initials='JS', sector='Infraestrutura',
         destination='Fazenda Modelo — inspeção',   date='2026-05-24', departure_time='14:00', return_time='18:00', status='pendente'),
    dict(veiculo=v4,  driver=paulo, vehicle_plate='KLD-8823', vehicle_label='KLD-8823 — Chevrolet Spin',
         driver_name='Paulo Oliveira',driver_initials='PO', sector='Administração',
         destination='Câmara — audiência pública',  date='2026-05-25', departure_time='09:00', return_time='13:00', status='pendente'),
    dict(veiculo=v2,  driver=tania, vehicle_plate='RNL-5591', vehicle_label='RNL-5591 — VW Gol',
         driver_name='Tânia Santos',  driver_initials='TS', sector='Saúde',
         destination='UPA Norte — medicamentos',    date='2026-05-23', departure_time='15:30', return_time='17:00', status='pendente'),
    # Aprovada
    dict(veiculo=v3,  driver=joao,  vehicle_plate='ZXC-1100', vehicle_label='ZXC-1100 — Fiat Strada',
         driver_name='João Silva',    driver_initials='JS', sector='Infraestrutura',
         destination='Secretaria de Obras',         date='2026-05-26', departure_time='08:00', return_time='11:00', status='reservado'),
    # Histórico
    dict(veiculo=v9,  driver=joao,  vehicle_plate='HSP-1023', vehicle_label='HSP-1023 — Fiat Argo',
         driver_name='João Silva',    driver_initials='JS', sector='Infraestrutura',
         destination='Secretaria de Saúde — entrega de insumos', date='2026-05-21', departure_time='08:15', return_time='10:40', km=47.2,  status='finalizada'),
    dict(veiculo=v1,  driver=joao,  vehicle_plate='CLR-3344', vehicle_label='CLR-3344 — Toyota Hilux',
         driver_name='João Silva',    driver_initials='JS', sector='Infraestrutura',
         destination='INSS — renovação de documentação',         date='2026-05-19', departure_time='13:00', return_time='16:20', km=82.5,  status='finalizada'),
    dict(veiculo=v9,  driver=paulo, vehicle_plate='HSP-1023', vehicle_label='HSP-1023 — Fiat Argo',
         driver_name='Paulo Oliveira',driver_initials='PO', sector='Administração',
         destination='Câmara Municipal',                          date='2026-05-15', departure_time='09:00', return_time='11:30', km=18.3,  status='finalizada'),
    dict(veiculo=v9,  driver=tania, vehicle_plate='HSP-1023', vehicle_label='HSP-1023 — Fiat Argo',
         driver_name='Tânia Santos',  driver_initials='TS', sector='Saúde',
         destination='UPA Norte',                                 date='2026-05-12', departure_time='14:00', return_time='15:45', km=31.0,  status='finalizada'),
    dict(veiculo=v2,  driver=carlos,vehicle_plate='RNL-5591', vehicle_label='RNL-5591 — VW Gol',
         driver_name='Carlos Mendes', driver_initials='CM', sector='Obras',
         destination='Fornecedor — retirada de materiais',        date='2026-05-08', departure_time='10:00', return_time='12:30', km=25.0,  status='recusada',
         admin_note='Veículo já reservado para outra secretaria nessa data.'),
]

for r in RESERVAS:
    # Evita duplicatas por (veiculo, driver, date, departure_time)
    exists = Reserva.objects.filter(
        veiculo=r['veiculo'], driver=r['driver'],
        date=r['date'], departure_time=r['departure_time']
    ).exists()
    if not exists:
        Reserva.objects.create(**r)
        print(f"  ✓ {r['vehicle_plate']} → {r['destination'][:40]} [{r['status']}]")
    else:
        print(f"  — já existe: {r['vehicle_plate']} {r['date']}")

print("\n✅ Seed concluído!")
print("\nCredenciais de acesso:")
print("  Admin  →  jackson / 12345678")
print("  Usuário → joao    / 12345678  (e outros: ruan, paulo, tania, carlos)")
