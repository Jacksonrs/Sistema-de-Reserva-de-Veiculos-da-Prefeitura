# Fleet - Gestão Inteligente de Frota Pública

<p align="center">
  <a href="#">
    <a href="https://github.com/Jacksonrs/Sistema-de-Reserva-de-Veiculos-da-Prefeitura">
    <img src="https://img.shields.io/badge/projeto-conclu%C3%ADdo-brightgreen?style=for-the-badge&labelColor=434343" alt="Status do Projeto"/>
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  </a>
  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <a href="https://www.djangoproject.com/">
    <img src="https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django" alt="Django"/>
  </a>
  <a href="https://www.postgresql.org/">
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </a>
</p>

---

## 1. Objetivo do sistema

O *Fleet* é uma solução web desenvolvida para apoiar prefeituras e órgãos públicos na gestão da frota municipal e intermunicipal.  
O objetivo principal é centralizar e modernizar o fluxo de informações de *veículos*, *servidores*, *viagens* e *métricas operacionais*. Substituindo os controlos manuais em papel por uma plataforma integrada, o sistema mitiga conflitos de agendamento, ociosidade de frotas e otimiza o planeamento das secretarias municipais (como Saúde, Educação e Infraestrutura).

---

## 2. Principais funcionalidades

### Módulo do Solicitante (Usuário Comum)
- Dashboard Pessoal: Visão geral resumida dos veículos disponíveis no momento e atalhos rápidos.
- Consulta de Frota Ativa: Listagem completa dos veículos da prefeitura com barra de busca por placa/modelo e filtros rápidos por status.
- Formulário de Agendamento: Solicitação intuitiva de veículos informando data, horários de saída/retorno, setor e destino/finalidade da viagem.
- Linha do Tempo (Histórico): Acompanhamento cronológico do status de cada pedido e visualização da quilometragem percorrida.
- Cancelamento de Solicitação: Permite ao utilizador cancelar agendamentos que ainda estejam aguardando análise.

### Módulo de Administração (Gestor da Frota)
- Painel Administrativo: Indicadores chave com o total de reservas pendentes, veículos em uso, unidades em manutenção e atividade recente.
- Fluxo de Auditoria e Aprovação: Central de análise de pedidos com comandos rápidos para aprovar ou recusar solicitações (com inserção de justificativa).
- Controle de Inventário (Frota): controle de veículos para registar placas, modelos, marcas, ano, tipo de combustível, capacidade e alteração manual de status.
- Gestão de Utilizadores: Registo de novos servidores institucionais e controlo de ativação/desativação de contas.
- Métricas Avançadas: Geração automática de relatórios visuais com gráficos de utilização por veículo, quilómetros rodados por mês e ranqueamento por secretaria.

---

## 3. Tecnologias utilizadas

- Frontend: React.js, TypeScript, Vite, Tailwind CSS
- Backend: Python, Django REST Framework
- Banco de Dados: PostgreSQL
- Controle de Versão: Git e GitHub
- Metodologia de organização: Kanban
- Biblioteca de Gráficos: Recharts
- Iconografia: Tabler Icons (`@tabler/icons-react`)


---

## 4. Como executar o projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (que inclui o gerenciador de pacotes `npm`)

### 4.1 Clonar o repositório

```bash
git clone https://github.com/Jacksonrs/Sistema-de-Reserva-de-Veiculos-da-Prefeitura 

cd Sistema-de-Reserva-de-Veiculos-da-Prefeitura
```

### 4.2 Instalar as dependências do Frontend

```bash
npm install
```

### 4.3 Executar o ambiente de desenvolvimento local

```bash
npm run dev
```

Para acessar o sistema, basta abrir o navegador e colar a seguinte URL: http://localhost:5173/

## 5. Como navegar/testar o protótipo
O sistema conta com uma camada de dados simulados para validar toda a navegação e regras de negócio diretamente na interface. Para testar os diferentes fluxos e permissões, utilize as credenciais pré-configuradas abaixo:

| Usuário (Login) | Senha | Perfil de Acesso | Interface e Permissões Disponíveis |
|---|---|---|---|
| joao | 12345678 | Usuário Comum | Dashboard simplificado, formulário de agendamento de veículos e linha do tempo de solicitações. |
| admin ou jackson | 12345678 | Administrador | Painel gerencial, controle de usuários, cadastro de frota, relatórios gráficos e central de aprovação/recusa de viagens. |

## Screenshots

### Tela de Acesso (Login Unificado)
![Dashboard](./assets/Dashboard.png)

## 6. Integrantes do grupo

<table align="center">
  <tr>
    <td align="center">
      <a href="hhttps://github.com/Jacksonrs">
        <img src="https://avatars.githubusercontent.com/u/147336900?v=4" width="100px;" alt="Jackson Reanan"/><br>
        <sub><b>Jackson Renan</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Ruanpabloband">
        <img src="https://avatars.githubusercontent.com/u/166414190?v=4" width="100px;" alt="Ruan Pablo"/><br>
        <sub><b>Ruan Pablo</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/marcelohdev">
        <img src="https://avatars.githubusercontent.com/u/106102036?v=4" width="100px;" alt="Marcelo Henrique"/><br>
        <sub><b>Marcelo Henrique</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/andevvs">
        <img src="https://avatars.githubusercontent.com/u/150745935?v=4" width="100px;" alt="Andrei Vieira"/><br>
        <sub><b>Andrei Vieira</b></sub>
      </a>
    </td>
  </tr>
</table>
