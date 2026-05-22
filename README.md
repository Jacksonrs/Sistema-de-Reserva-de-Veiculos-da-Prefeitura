# Fleet 🚗

Sistema inteligente de gerenciamento e reserva de veículos para prefeituras e órgãos públicos.

O Fleet foi desenvolvido com foco em organização de frota, controle de viagens e gerenciamento administrativo, permitindo que usuários solicitem reservas de veículos e administradores controlem toda a operação da frota em tempo real.

---

# ✨ Visão Geral

O sistema possui dois ambientes principais:

## 👤 Usuário Comum
- Login no sistema
- Visualização de veículos disponíveis
- Agendamento de reservas
- Histórico de solicitações
- Dashboard informativo

## 🛠️ Administrador
- Painel administrativo
- Aprovação e recusa de reservas
- Controle de veículos
- Gerenciamento de usuários
- Relatórios
- Controle de status da frota

---

# 🖥️ Tecnologias Utilizadas

## Frontend
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Context API

## Ferramentas
- Vite
- Git
- GitHub

## Backend (Planejamento Futuro)
- Django
- Django REST Framework
- PostgreSQL

---

# 📂 Estrutura do Projeto

```bash
src/
│
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── Badge.tsx
│   └── Toast.tsx
│
├── context/
│   └── AppContext.tsx
│
├── data/
│   └── mockData.ts
│
├── hooks/
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── AgendarPage.tsx
│   ├── VeiculosPage.tsx
│   ├── HistoricoPage.tsx
│   ├── RelatoriosPage.tsx
│   └── LoginPage.tsx
│
├── types/
│   └── index.ts
│
├── utils/
│   └── formatters.ts
│
├── App.tsx
├── main.tsx
└── index.css

## ⚙️ Como Rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build


#######

Acesse:

http://localhost:5173

🔑 Login de Demonstração

Utilize qualquer usuário e senha não vazios.

Exemplo:

Usuário: motorista01
Senha: 12345678