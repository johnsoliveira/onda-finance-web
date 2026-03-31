# Onda Finance Web

Aplicação construída com React, Vite e TypeScript para simular uma experiência institucional de login, dashboard financeiro e fluxo de transferências.

Além do frontend, o projeto agora conta com uma mini API local em Node.js com SQLite para autenticação, leitura do dashboard e persistência de transferências.

O projeto hoje contempla:
- login com validação de formulário
- dashboard com dados persistidos em SQLite
- fluxo de transferências em múltiplas etapas
- persistência local com Zustand
- atualização de saldo via React Query
- mini API local com seed a partir dos mocks originais
- setup inicial de testes com Vitest

## Como rodar o projeto

### Requisitos

- Node.js 20+ recomendado
- npm

### Instalação

```bash
npm install
```

Se houver conflito de dependências por causa de `react-query@3` com `react@19`, rode:

```bash
npm install --legacy-peer-deps
```

### Ambiente de desenvolvimento

Para subir frontend e API juntos:

```bash
npm run dev:full
```

Esse comando sobe:
- Vite em `http://localhost:5173`
- mini API em `http://localhost:3001`

Se preferir rodar separado:

```bash
npm run api
npm run dev
```

Check rápido da API:

```bash
curl http://localhost:3001/api/health
```

Se a resposta for `{"status":"ok"}`, o proxy do Vite também estará apto a responder chamadas como:

```bash
curl "http://localhost:5173/api/dashboard?agencia=0001&conta=12345"
```

O app expõe principalmente estas rotas:

- `/` ou `/login`: tela de login
- `/dashboard`: dashboard do usuário autenticado
- `/transfers`: fluxo de transferência

### Banco SQLite

- O banco fica em `server/data/onda.sqlite`
- Na primeira inicialização da API, o banco é criado automaticamente
- O seed inicial usa os dados definidos em [server/mock-users.mjs](/Users/jonatanoliveira/Projects/onda-finance-web/server/mock-users.mjs)

### Build de produção

```bash
npm run build
```

### Preview local do build

```bash
npm run preview
```

### Testes

```bash
npm test
```

Modo watch:

```bash
npm run test:watch
```

## Credenciais iniciais

O projeto usa como seed inicial os dados de [server/mock-users.mjs](/Users/jonatanoliveira/Projects/onda-finance-web/server/mock-users.mjs). Exemplos atuais:

- Agência `0001`, Conta `12345`, Senha `admin1`
- Agência `1111`, Conta `22222`, Senha `joao12`
- Agência `9999`, Conta `88888`, Senha `maria7`

## Estrutura principal

```txt
src/
  components/ui/      componentes reutilizáveis e wrappers de UI
  data/               mocks locais de usuários e dashboard
  hooks/              hooks de autenticação e dados
  pages/              páginas de Login, Dashboard e Transfers
  routes/             definição de rotas com react-router-dom
  service/            cliente HTTP da aplicação
  store/              stores persistidos com Zustand
  test/               setup global do Vitest
  utils/              máscaras e formatadores
server/
  data/               arquivo SQLite gerado em runtime
  db.mjs              acesso e seed do banco SQLite
  index.mjs           mini API HTTP local
  mock-users.mjs      seed inicial do banco
```

## Decisões técnicas adotadas

### 1. Vite + React + TypeScript

O projeto usa Vite para obter:
- inicialização rápida em desenvolvimento
- build simples
- integração direta com Tailwind e Vitest

### 2. Tailwind CSS v4 como base visual

O styling está centralizado em [`src/index.css`](/Users/jonatanoliveira/Projects/onda-finance-web/src/index.css) com tokens de design e classes utilitárias. Isso ajuda a:
- manter consistência visual
- acelerar prototipação
- permitir ajustes rápidos em telas editoriais e dashboards

### 3. `react-router-dom` para navegação

As rotas são declaradas manualmente em [`src/routes/index.tsx`](/Users/jonatanoliveira/Projects/onda-finance-web/src/routes/index.tsx). Essa abordagem foi mantida simples porque o projeto ainda é pequeno e tem poucas telas principais.

### 4. Zustand persistido para estado local

Foram separados dois stores:

- [`src/store/useAuthStore.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/store/useAuthStore.ts)
  Responsável por usuário autenticado e sessão persistida.

- [`src/store/useTransferStore.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/store/useTransferStore.ts)
  Responsável pelo onboarding de transferência, valor, destinatário e comprovante.

O uso de `persist` foi uma escolha intencional para:
- evitar perda de contexto ao atualizar a página
- preservar o progresso do fluxo de transferência
- facilitar prototipação sem backend real

### 5. React Query + mini API local

O frontend consome a API local por meio de [src/service/api.ts](/Users/jonatanoliveira/Projects/onda-finance-web/src/service/api.ts), enquanto o Vite faz proxy de `/api` para `http://localhost:3001`.

Hoje os principais fluxos passam por:

- [`src/hooks/use-dashboard-data.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/hooks/use-dashboard-data.ts)
  Busca os dados de dashboard por agência e conta.

- [`src/hooks/use-update-dashboard-balance.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/hooks/use-update-dashboard-balance.ts)
  Atualiza saldo, liquidez e transações no cache do dashboard.

- [`src/hooks/use-create-transfer.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/hooks/use-create-transfer.ts)
  Executa a transferência persistindo os dados no SQLite.

Essa estrutura deixa o projeto mais próximo de um backend real sem complicar demais o setup local.

### 6. SQLite com seed por usuário

Os dados seedados foram organizados por usuário, incluindo:
- documento
- nome do banco
- saldo e métricas do dashboard
- transações específicas por cliente

Isso melhora a fidelidade da navegação entre contas e permite persistir alterações reais durante a sessão.

### 7. React Hook Form + Zod para validação

Já existem formulários validados em:

- [`src/pages/Login/index.tsx`](/Users/jonatanoliveira/Projects/onda-finance-web/src/pages/Login/index.tsx)
- [`src/pages/Transfers/transfer-recipient-page.tsx`](/Users/jonatanoliveira/Projects/onda-finance-web/src/pages/Transfers/transfer-recipient-page.tsx)

Essa combinação foi adotada para:
- manter validação declarativa
- ter mensagens claras de erro
- facilitar reaproveitamento e evolução das regras

### 8. `AppSidebar` reutilizável com variantes

O componente [`src/components/ui/app-sidebar.tsx`](/Users/jonatanoliveira/Projects/onda-finance-web/src/components/ui/app-sidebar.tsx) suporta pelo menos dois contextos:

- `brand`: sidebar do dashboard
- `workflow`: sidebar do fluxo de transferência

Isso evita duplicação de layout e mantém consistência entre páginas com navegações laterais diferentes.

### 9. Vitest configurado desde já

O projeto já conta com:
- config de teste no [`vite.config.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/vite.config.ts)
- setup em [`src/test/setup.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/test/setup.ts)
- teste inicial do store em [`src/store/useTransferStore.test.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/store/useTransferStore.test.ts)

Isso cria uma base mínima para evolução com segurança.

## Melhorias futuras

### Prioridade alta

- Finalizar a integração do `Select` com `react-hook-form` de forma totalmente controlada e consistente em toda a tela de destinatário.

- Adicionar proteção de rotas mais robusta.
  Hoje o redirecionamento depende das páginas verificarem `user` localmente.

- Melhorar a autenticação.
  Hoje a API valida agência, conta e senha em texto puro, suficiente para ambiente local, mas não para produção.

### Prioridade média

- Expandir a suíte de testes para:
  - máscaras em [`src/utils/mask.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/utils/mask.ts)
  - hooks de dashboard
  - fluxo de transferência
  - validações dos formulários

- Criar componentes de domínio para o fluxo financeiro:
  - `AmountField`
  - `RecipientForm`
  - `ReceiptCard`
  - `DashboardSummary`

- Melhorar acessibilidade:
  - navegação por teclado
  - estados focados
  - labels e descrições mais consistentes

### Prioridade baixa

- Adicionar internacionalização para moedas, datas e textos.

- Implementar code splitting por rota.
  O build já mostra warning de chunk grande, então esse é um bom próximo passo técnico.

- Evoluir a mini API com camadas separadas para rotas, serviços e repositórios.

## Observações sobre o estado atual

- O projeto está funcional para prototipação e demonstração de fluxo.
- A base de UI e estado já está estruturada para crescer.
- Há pontos de refinamento importantes antes de considerar ambiente produtivo, especialmente em autenticação, segurança e estrutura do backend.

## Comandos úteis

```bash
npm run api
npm run dev
npm run dev:full
npm run build
npm run preview
npm run test
npm run test:watch
```
