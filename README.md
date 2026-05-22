# DriveControl — Sistema de Reserva de Veículos

Plataforma de gestão de frotas para prefeituras municipais.  
Desenvolvido com **React 18 + TypeScript + Vite**.

---

## Estrutura do projeto

```
reserva-veiculos/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx            # Ponto de entrada
    ├── App.tsx             # Roteamento de páginas
    ├── index.css           # Design tokens + estilos globais
    ├── App.css
    ├── types/
    │   └── index.ts        # Interfaces TypeScript
    ├── data/
    │   └── mockData.ts     # Dados de exemplo
    ├── context/
    │   └── AppContext.tsx  # Estado global (auth, nav, dados)
    ├── utils/
    │   └── formatters.ts   # Helpers de formatação
    ├── components/
    │   ├── Badge.tsx       # Badge reutilizável
    │   ├── Sidebar.tsx     # Navegação lateral
    │   ├── Topbar.tsx      # Barra superior
    │   └── Toast.tsx       # Notificações
    └── pages/
        ├── LoginPage.tsx
        ├── DashboardPage.tsx
        ├── AgendarPage.tsx
        ├── VeiculosPage.tsx
        ├── HistoricoPage.tsx
        └── RelatoriosPage.tsx
```

---

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

Acesse: `http://localhost:5173`

**Login:** qualquer usuário não vazio (ex: `motorista01` / `12345678`)

---

## Funcionalidades

| Página | Descrição |
|---|---|
| **Dashboard** | KPIs, veículos em uso e próximos agendamentos |
| **Agendar** | Formulário com validação + seleção visual de veículo |
| **Veículos** | Lista com filtro por status e busca por placa/modelo |
| **Histórico** | Linha do tempo, cancelamento de reservas e tabela completa |
| **Relatórios** | Taxa de utilização, análise por veículo e por setor |

---

## Dependências

| Pacote | Versão |
|---|---|
| react | 18.3 |
| typescript | 5.7 |
| vite | 6.0 |
| @tabler/icons | 3.22 (CDN) |
| DM Sans / DM Mono | Google Fonts (CDN) |
