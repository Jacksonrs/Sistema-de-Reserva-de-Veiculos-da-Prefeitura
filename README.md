# Fleet - Sistema de Reserva de Veiculos da Prefeitura

<p align="center">
  <a href="https://github.com/Jacksonrs/Sistema-de-Reserva-de-Veiculos-da-Prefeitura">
    <img src="https://img.shields.io/badge/status-MVP%20implementado-brightgreen?style=for-the-badge&labelColor=434343" alt="Status do projeto"/>
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  </a>
  <a href="https://vite.dev/">
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  </a>
  <br>
  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  </a>
  <a href="https://www.djangoproject.com/">
    <img src="https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django" alt="Django"/>
  </a>
  <a href="https://www.django-rest-framework.org/">
    <img src="https://img.shields.io/badge/Django%20REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=darkred&labelColor=434343" alt="Django REST Framework"/>
  </a>
  <a href="https://jwt.io/">
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT"/>
  </a>
  <a href="https://www.sqlite.org/">
    <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
  </a>
  <br>
  <a href="https://recharts.org/">
    <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=Recharts&logoColor=white" alt="Recharts"/>
  </a>
  <a href="https://tabler-icons.io/">
    <img src="https://img.shields.io/badge/Tabler_Icons-0054a6?style=for-the-badge" alt="Tabler Icons"/>
  </a>
  <a href="https://git-scm.com/">
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git"/>
  </a>
</p>

Sistema web para apoiar a gestao de reservas de veiculos de uma prefeitura. A aplicacao permite que servidores solicitem veiculos, acompanhem suas reservas e que gestores controlem frota, usuarios, aprovacoes e historico de uso.

---

## Status atual do desenvolvimento

**MVP implementado.** A versao atual possui backend, frontend, autenticacao JWT, perfis de acesso, cadastro de veiculos, cadastro de usuarios, solicitacao de reservas, aprovacao, recusa, cancelamento, finalizacao e paineis de acompanhamento.

O sistema ainda pode evoluir com:

- notificacoes para mudancas de status;
- relatorios mais completos;
- exportacao de dados em PDF ou CSV;
- deploy publico;
- integracao com sistemas externos da prefeitura.

## Objetivo do sistema

Centralizar o processo de reserva de veiculos da frota publica em uma aplicacao digital, reduzindo controles manuais, conflitos de agenda e falta de visibilidade sobre a disponibilidade dos veiculos.

## Descricao do problema

Em muitos orgaos publicos, a reserva de veiculos ainda depende de planilhas, mensagens, papel ou comunicacao direta com o setor responsavel. Esse processo dificulta a verificacao de disponibilidade, torna o historico pouco confiavel e aumenta o risco de conflito entre solicitacoes.

O Fleet busca resolver esse problema oferecendo um fluxo unico para:

- consultar veiculos disponiveis;
- solicitar uma reserva;
- aprovar ou recusar pedidos;
- cancelar reservas quando necessario;
- finalizar reservas e registrar quilometragem;
- acompanhar o historico de uso;
- manter o cadastro da frota e dos usuarios atualizado.

## Principais funcionalidades

### Usuario comum

- Login no sistema.
- Visualizacao do painel inicial.
- Consulta da frota cadastrada.
- Criacao de solicitacoes de reserva.
- Acompanhamento do historico de reservas.
- Cancelamento de reservas permitidas.
- Finalizacao de reservas com registro de quilometragem.

### Administrador / gestor da frota

- Painel administrativo com indicadores.
- Cadastro, edicao, ativacao/desativacao e remocao de usuarios.
- Cadastro, edicao, atualizacao de status e remocao de veiculos.
- Analise de reservas pendentes.
- Aprovacao ou recusa de solicitacoes.
- Finalizacao de reservas.
- Consulta de metricas operacionais e relatorios graficos.

## Prototipo navegavel

O prototipo navegavel utilizado na entrega e a propria interface React do MVP.

- Link local do frontend: `http://localhost:5173`
- Backend local: `http://localhost:8000`
- Codigo do prototipo/interface: `frontend/src/`

Para acessar o prototipo, execute o backend e o frontend conforme as instrucoes deste README.

## Tecnologias utilizadas

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, CSS |
| Backend | Python, Django 5, Django REST Framework |
| Autenticacao | JWT com `djangorestframework-simplejwt` |
| Banco de dados | SQLite |
| Graficos | Recharts |
| Icones | Tabler Icons Webfont |
| Versionamento | Git e GitHub |
| Organizacao | Backlog priorizado / Kanban |

> Observacao: o frontend usa CSS comum. O projeto nao utiliza Tailwind CSS.

## Arquitetura minima

O sistema segue uma arquitetura cliente-servidor. O frontend React e responsavel pela experiencia do usuario e se comunica com uma API REST criada em Django. O backend centraliza autenticacao, permissoes, regras de negocio e persistencia dos dados.

### Fluxo basico de funcionamento

```text
Usuario
  -> Frontend React/Vite
    -> API REST Django
      -> Apps de dominio: usuarios, veiculos e reservas
        -> Banco SQLite
```

1. O usuario acessa o frontend pelo navegador.
2. O frontend envia requisicoes HTTP para a API REST.
3. O backend valida autenticacao JWT, permissoes e regras de negocio.
4. Os dados sao lidos ou gravados no banco SQLite.
5. A API retorna respostas em JSON para atualizacao das telas.

### Responsabilidades dos principais componentes

| Componente | Responsabilidade |
| --- | --- |
| `frontend/src/App.tsx` | Define a estrutura principal da aplicacao e controla as telas exibidas. |
| `frontend/src/context/AppContext.tsx` | Centraliza estado da aplicacao usado pelas telas. |
| `frontend/src/services/api.ts` | Concentra comunicacao com a API, autenticacao, refresh de token e mapeamento dos dados. |
| `frontend/src/pages/` | Contem as telas do usuario comum e do administrador. |
| `frontend/src/components/` | Componentes reutilizaveis como sidebar, topbar, avatar, badge, toast e skeleton. |
| `backend/core/` | Configuracao principal do Django, rotas globais e integracao dos apps. |
| `backend/usuarios/` | Modelo de usuario, autenticacao, permissoes, serializers e endpoints de usuarios. |
| `backend/veiculos/` | Cadastro, consulta e atualizacao da frota. |
| `backend/reservas/` | Criacao, consulta, cancelamento, aprovacao, recusa, finalizacao e estatisticas de reservas. |

## Backlog do MVP

| Prioridade | Historia de usuario | Status |
| --- | --- | --- |
| Alta | Como usuario, quero fazer login para acessar o sistema com seguranca. | Implementado |
| Alta | Como usuario, quero consultar veiculos disponiveis para planejar uma solicitacao. | Implementado |
| Alta | Como usuario, quero solicitar uma reserva informando data, horario, setor e destino. | Implementado |
| Alta | Como gestor, quero aprovar ou recusar reservas para controlar o uso da frota. | Implementado |
| Alta | Como gestor, quero cadastrar e manter veiculos para atualizar a frota disponivel. | Implementado |
| Media | Como usuario, quero acompanhar meu historico de reservas para saber o status dos pedidos. | Implementado |
| Media | Como usuario, quero cancelar uma reserva quando ela nao for mais necessaria. | Implementado |
| Media | Como usuario, quero finalizar uma reserva e informar a quilometragem utilizada. | Implementado |
| Media | Como gestor, quero cadastrar e ativar/desativar usuarios para controlar acessos. | Implementado |
| Media | Como gestor, quero visualizar indicadores no dashboard para acompanhar a operacao. | Implementado |
| Baixa | Como gestor, quero visualizar relatorios graficos para analisar o uso da frota. | Parcialmente implementado |
| Baixa | Como usuario, quero receber notificacoes sobre aprovacao/recusa de reservas. | Nao implementado |
| Baixa | Como gestor, quero exportar relatorios em PDF/CSV para prestacao de contas. | Nao implementado |

## Estrutura do projeto

```text
Sistema-de-Reserva-de-Veiculos-da-Prefeitura/
|-- backend/
|   |-- core/                 # Configuracoes principais do Django
|   |-- usuarios/             # Usuarios, autenticacao e permissoes
|   |-- veiculos/             # Cadastro e controle de veiculos
|   |-- reservas/             # Reservas e fluxo de aprovacao
|   |-- manage.py             # Utilitario de gerenciamento do Django
|   |-- requirements.txt      # Dependencias Python
|   |-- seed.py               # Dados iniciais para demonstracao
|
|-- frontend/
|   |-- assets/               # Imagens usadas no projeto
|   |-- public/               # Arquivos publicos do Vite
|   |-- src/
|   |   |-- components/       # Componentes reutilizaveis
|   |   |-- context/          # Estado global da aplicacao
|   |   |-- pages/            # Telas principais e administrativas
|   |   |-- services/         # Cliente da API
|   |   |-- types/            # Tipagens TypeScript
|   |   |-- utils/            # Funcoes utilitarias
|   |-- package.json          # Dependencias e scripts do frontend
|   |-- vite.config.ts        # Configuracao do Vite e proxy para a API
|
|-- README.md                 # Documentacao do projeto
|-- .gitignore
```

## Como executar o projeto

### Pre-requisitos

- Git
- Python 3.10 ou superior
- Node.js 18 ou superior

### 1. Clonar o repositorio

```bash
git clone https://github.com/Jacksonrs/Sistema-de-Reserva-de-Veiculos-da-Prefeitura
cd Sistema-de-Reserva-de-Veiculos-da-Prefeitura
```

### 2. Configurar e executar o backend

No Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed.py
python manage.py runserver
```

No Linux/macOS:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed.py
python manage.py runserver
```

O backend ficara disponivel em:

```text
http://localhost:8000
```

### 3. Configurar e executar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:5173
```

## Variaveis de ambiente

O backend usa `python-decouple`. As configuracoes possuem valores padrao para desenvolvimento, entao o projeto executa sem arquivo `.env`.

Caso queira sobrescrever as configuracoes, crie `backend/.env`:

```env
SECRET_KEY=sua-chave-local
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

No frontend, a API usa `/api` por padrao e o Vite redireciona as chamadas para `http://localhost:8000`. Para apontar diretamente para outra API, crie `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Credenciais de demonstracao

Depois de executar `python seed.py`, use:

| Perfil | Usuario | Senha |
| --- | --- | --- |
| Administrador | `jackson` | `12345678` |
| Usuario comum | `joao` | `12345678` |
| Usuario comum | `ruan` | `12345678` |
| Usuario comum | `paulo` | `12345678` |
| Usuario comum | `tania` | `12345678` |
| Usuario comum | `carlos` | `12345678` |

Tambem e possivel criar um superusuario manualmente:

```bash
python manage.py createsuperuser
```

## Como navegar e testar

1. Acesse `http://localhost:5173`.
2. Entre como administrador usando `jackson / 12345678`.
3. Confira dashboard, usuarios, veiculos e reservas pendentes.
4. Aprove ou recuse uma reserva.
5. Entre como usuario comum usando `joao / 12345678`.
6. Crie uma nova solicitacao de reserva.
7. Consulte o historico e acompanhe a mudanca de status.

## Endpoints principais

| Recurso | Rota base |
| --- | --- |
| Autenticacao | `/api/auth/` |
| Usuarios | `/api/usuarios/` |
| Veiculos | `/api/veiculos/` |
| Reservas | `/api/reservas/` |
| Admin Django | `/admin/` |

## Evidencias de evolucao

A evolucao do projeto pode ser demonstrada por:

- organizacao do codigo em frontend e backend;
- separacao por apps de dominio no Django;
- uso de autenticacao JWT e permissoes por perfil;
- transformacao dos requisitos em telas navegaveis;
- backlog priorizado com status de implementacao;
- dados iniciais para demonstracao do fluxo completo;
- apresentacao do fluxo completo de reserva durante o pitch tecnico.

## Integrantes da equipe

| [<img src="https://avatars.githubusercontent.com/u/147336900?v=4" width="110" style="border-radius: 50%;">](https://github.com/Jacksonrs) | [<img src="https://avatars.githubusercontent.com/u/166414190?v=4" width="110" style="border-radius: 50%;">](https://github.com/Ruanpabloband) | [<img src="https://avatars.githubusercontent.com/u/106102036?v=4" width="110" style="border-radius: 50%;">](https://github.com/marcelohdev) | [<img src="https://avatars.githubusercontent.com/u/150745935?v=4" width="110" style="border-radius: 50%;">](https://github.com/andevvs) |
| :---: | :---: | :---: | :---: |
| [**Jackson Renan**](https://github.com/Jacksonrs) | [**Ruan Pablo**](https://github.com/Ruanpabloband) | [**Marcelo Henrique**](https://github.com/marcelohdev) | [**Andrei Vieira**](https://github.com/andevvs) |
| Jackson Renan Oliveira dos Santos<br>`2023011455` | Ruan Pablo Bandeira de Oliveira<br>`2023022946` | Marcelo Henrique Messias Cavalcante<br>`2023011357` | Andrei Vieira e Silva<br>`2023022919` |