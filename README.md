# Futebol Clube ⚽

[![NodeJS](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

> Plataforma Full Stack para gestão de campeonatos de futebol, controle de partidas e cálculo de classificação em tempo real (geral, mandante e visitante) com autenticação baseada em funções (RBAC).

---

## 📌 Visão Geral & Funcionalidades

O **Futebol Clube** é uma solução completa projetada para acompanhar e gerenciar ligas esportivas:

- **Classificação em Tempo Real**: Cálculo dinâmico de pontuação, vitórias, empates, derrotas, saldo de gols e taxa de eficiência com ordenação oficial de desempate.
- **Visualização Filtrada**: Acesso às tabelas de classificação geral, mandante (`/home`) e visitante (`/away`).
- **Autenticação & RBAC (Role-Based Access Control)**:
  - Usuários visitantes: visualização de partidas e tabelas de classificação.
  - Usuários administradores: criação de novas partidas, edição de placares em andamento e encerramento de jogos.
- **Dual Database Architecture (MySQL & SQLite)**:
  - **Local / Docker**: Roda com container **MySQL 8** e persistência em volumes.
  - **Deploy / Standalone (Render.com)**: Roda nativamente com **SQLite embutido**, permitindo hospedagem gratuita sem custos com instâncias de banco externas.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
- **Node.js & Express**: Arquitetura em camadas (MSC - Model, Service, Controller).
- **TypeScript**: Tipagem estrita de ponta a ponta.
- **Prisma ORM**: Modelagem declarativa e consultas com segurança de tipo.
- **MySQL & SQLite**: Suporte transparente a ambos os bancos de dados via Prisma.
- **JWT (JSON Web Tokens) & Bcrypt**: Autenticação stateless e criptografia de senhas.
- **Vitest & Supertest**: Testes automatizados unitários e de integração de alto desempenho.

### Front-end
- **React.js & React Router**: Interface reativa e navegação em SPA.
- **Axios**: Comunicação assíncrona com a API RESTful.
- **Custom CSS**: Estilização temática esportiva com responsividade.

---

## 🚀 Como Executar o Projeto

### Opção 1: Com Docker Compose (MySQL) - Recomendado

Certifique-se de ter o Docker e Docker Compose instalados:

```bash
# Clone o repositório
git clone https://github.com/Ludson96/project-trybe-football-club.git
cd project-trybe-football-club

# Suba a aplicação completa em 1 comando (MySQL + Back-end + Front-end)
npm run compose:up
```

Acesse a aplicação no navegador:
- **Front-end**: [http://localhost:3000](http://localhost:3000)
- **Back-end API**: [http://localhost:3001](http://localhost:3001)

Para encerrar os containers:
```bash
npm run compose:down
```

---

### Opção 2: Local com SQLite (Rápido e sem Docker)

```bash
# 1. Instalar dependências e preparar o banco
cd app/backend
npm install
npm run db:setup

# 2. Iniciar o servidor backend
npm run dev
```

Em outro terminal, inicie o front-end:
```bash
cd app/frontend
npm install
npm start
```

---

## 🧪 Executando os Testes Automatizados

A suíte de testes foi construída com **Vitest** e **Supertest**:

```bash
cd app/backend

# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

---

## 🔑 Credenciais para Teste

| Perfil | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@admin.com` | `secret_admin` | Criar, editar placares e finalizar partidas |
| **Usuário Comum** | `user@user.com` | `secret_user` | Visualização de partidas e tabelas |

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por [Ludson](https://github.com/Ludson96).
