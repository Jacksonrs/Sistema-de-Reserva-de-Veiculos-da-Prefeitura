# Backend — Sistema de Reserva de Veículos da Prefeitura

API REST em Django + DRF com autenticação JWT.

---

## Estrutura do projeto

```
backend/
├── core/               # Configurações Django (settings, urls, wsgi)
├── usuarios/           # Model customizado, auth JWT, CRUD de usuários
├── veiculos/           # CRUD de veículos + atualização de status
├── reservas/           # Solicitações, aprovação, recusa, histórico, stats
├── seed.py             # Popula banco com dados iniciais do frontend
├── manage.py
└── requirements.txt
```

---

## Como rodar

### 1. Criar e ativar o ambiente virtual

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env se necessário (a chave padrão funciona em desenvolvimento)
```

### 4. Criar as tabelas do banco

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Popular o banco com dados iniciais

```bash
python seed.py
```

Isso cria todos os usuários, veículos e reservas de exemplo do mockData do frontend.

### 6. Iniciar o servidor

```bash
python manage.py runserver
```

API disponível em: **http://localhost:8000/api/**

---

## Credenciais iniciais

| Usuário   | Senha     | Perfil  |
|-----------|-----------|---------|
| jackson   | 12345678  | admin   |
| joao      | 12345678  | usuario |
| ruan      | 12345678  | usuario |
| paulo     | 12345678  | usuario |
| tania     | 12345678  | usuario |
| carlos    | 12345678  | usuario |

---

## Endpoints da API

### Autenticação

| Método | Endpoint            | Descrição                         | Acesso |
|--------|---------------------|-----------------------------------|--------|
| POST   | `/api/auth/login/`  | Login → retorna `access` + `refresh` + `user` | Público |
| POST   | `/api/auth/refresh/`| Renova o access token             | Público |
| GET    | `/api/auth/me/`     | Dados do usuário autenticado      | Autenticado |

**Exemplo de login:**
```json
POST /api/auth/login/
{
  "username": "jackson",
  "password": "12345678"
}
```

---

### Usuários (apenas admin)

| Método | Endpoint                          | Descrição              |
|--------|-----------------------------------|------------------------|
| GET    | `/api/usuarios/`                  | Lista todos            |
| POST   | `/api/usuarios/`                  | Cria novo usuário      |
| GET    | `/api/usuarios/<id>/`             | Detalhe                |
| PATCH  | `/api/usuarios/<id>/`             | Atualiza               |
| DELETE | `/api/usuarios/<id>/`             | Remove                 |
| PATCH  | `/api/usuarios/<id>/toggle-ativo/`| Ativa / desativa       |

---

### Veículos

| Método | Endpoint                      | Descrição                    | Acesso      |
|--------|-------------------------------|------------------------------|-------------|
| GET    | `/api/veiculos/`              | Lista todos (filtro: `?status=disponivel`) | Autenticado |
| POST   | `/api/veiculos/`              | Cadastra                     | Admin       |
| GET    | `/api/veiculos/<id>/`         | Detalhe                      | Autenticado |
| PATCH  | `/api/veiculos/<id>/`         | Atualiza                     | Admin       |
| DELETE | `/api/veiculos/<id>/`         | Remove                       | Admin       |
| PATCH  | `/api/veiculos/<id>/status/`  | Atualiza status              | Admin       |

---

### Reservas

| Método | Endpoint                        | Descrição                          | Acesso      |
|--------|---------------------------------|------------------------------------|-------------|
| GET    | `/api/reservas/`                | Lista (admin: todas; user: suas)   | Autenticado |
| POST   | `/api/reservas/`                | Solicita reserva                   | Autenticado |
| GET    | `/api/reservas/<id>/`           | Detalhe                            | Autenticado |
| PATCH  | `/api/reservas/<id>/cancelar/`  | Cancela                            | Dono/Admin  |
| PATCH  | `/api/reservas/<id>/acao/`      | Aprovar / recusar / finalizar      | Admin       |
| GET    | `/api/reservas/stats/`          | Contadores do dashboard            | Admin       |

**Ação do admin:**
```json
PATCH /api/reservas/1/acao/
{
  "action": "aprovar"          // ou "recusar" ou "finalizar"
  "admin_note": "Motivo...",   // (opcional, usado em recusa)
  "km": 42.5                   // (opcional, usado em finalizar)
}
```

---

## Usando com o frontend React

No seu frontend, troque as chamadas ao `mockData` por chamadas à API.
Salve o token JWT no `localStorage` após o login e envie no header:

```ts
// Exemplo de login
const res = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
})
const { access, refresh, user } = await res.json()
localStorage.setItem('token', access)

// Exemplo de requisição autenticada
const resp = await fetch('http://localhost:8000/api/veiculos/', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
})
```

---

## Admin do Django

Acesse `http://localhost:8000/admin/` com:
```
python manage.py createsuperuser
```
Ou use o usuário **jackson** após rodar o seed (defina `is_superuser=True` via shell se precisar).
