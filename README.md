# Onda Finance Web

Aplicação frontend construída com React, Vite e TypeScript para simular uma experiência institucional de login, dashboard financeiro e fluxo de transferências.

O projeto hoje contempla:
- login com validação de formulário
- dashboard com dados mockados por usuário
- fluxo de transferências em múltiplas etapas
- persistência local com Zustand
- atualização de saldo via React Query
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

```bash
npm run dev
```

O app sobe via Vite e, no estado atual, expõe principalmente estas rotas:

- `/` ou `/login`: tela de login
- `/dashboard`: dashboard do usuário autenticado
- `/transfers`: fluxo de transferência

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

## Credenciais mockadas

O projeto usa dados locais em [`src/data/mockUsers.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/data/mockUsers.ts). Exemplos atuais:

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
  store/              stores persistidos com Zustand
  test/               setup global do Vitest
  utils/              máscaras e formatadores
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

### 5. React Query para leitura e mutação de dados simulados

Mesmo usando mocks locais, o projeto já trata esses dados como se viessem de uma API:

- [`src/hooks/use-dashboard-data.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/hooks/use-dashboard-data.ts)
  Busca os dados de dashboard por agência e conta.

- [`src/hooks/use-update-dashboard-balance.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/hooks/use-update-dashboard-balance.ts)
  Atualiza saldo, liquidez e transações no cache do dashboard.

Essa decisão prepara o código para uma futura troca dos mocks por API real com pouco impacto na UI.

### 6. Mock por usuário em vez de mock global único

Os dados em [`src/data/mockUsers.ts`](/Users/jonatanoliveira/Projects/onda-finance-web/src/data/mockUsers.ts) foram organizados por usuário, incluindo:
- documento
- nome do banco
- saldo e métricas do dashboard
- transações específicas por cliente

Isso melhora a fidelidade da navegação entre contas e evita uma UI “genérica”.

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

- Corrigir o fluxo de débito da transferência para garantir que o saldo seja atualizado uma única vez.
  Hoje há sinal de débito no submit do destinatário e também no comprovante, o que indica risco de dupla atualização.

- Finalizar a integração do `Select` com `react-hook-form` de forma totalmente controlada e consistente em toda a tela de destinatário.

- Adicionar proteção de rotas mais robusta.
  Hoje o redirecionamento depende das páginas verificarem `user` localmente.

- Separar melhor a camada de mock da camada de serviço.
  Idealmente, `mockUsers` deveria alimentar um serviço/repositório, e não ser acessado diretamente por vários hooks.

### Prioridade média

- Migrar de `react-query@3` para `@tanstack/react-query` atual.
  Isso reduziria incompatibilidades com React 19 e simplificaria instalação sem `--legacy-peer-deps`.

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

- Evoluir o README com prints, fluxos e decisões de produto.

## Observações sobre o estado atual

- O projeto está funcional para prototipação e demonstração de fluxo.
- A base de UI e estado já está estruturada para crescer.
- Há pontos de refinamento importantes antes de considerar ambiente produtivo, especialmente no fluxo de transferência e na camada de dados.

## Comandos úteis

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
```
