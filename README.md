# 🍕 Pizzaria MAGNATA

> Sistema de pedidos online premium com painel admin em tempo real.

**Live demo:** `https://SEU-USUARIO.github.io/magnata-pizza`

---

## ✨ Funcionalidades

### Para o Cliente
- **Catálogo completo** com 40 sabores (Salgadas, Doces, Promocionais)
- **Meio a Meio** — escolha 2 sabores; cobra-se o preço da mais cara
- **Configurador em 5 passos** — Tipo → Tamanho → Borda → Adicionais → Resumo
- **Bordas** Simples (R$ 12) e Especial (R$ 15) com sabores personalizáveis
- **Extras** — Bebidas e molhos antes de fechar o pedido
- **Carrinho persistente** — sobrevive ao reload da página
- **Histórico de pedidos** com status em tempo real
- **Autenticação segura** via Supabase Auth (JWT + Refresh Token)

### Para o Admin
- **Painel em tempo real** — novos pedidos aparecem automaticamente (WebSocket)
- **Notificação sonora** ao receber novo pedido
- **Confirmação via WhatsApp** — mensagem pré-formatada com um clique
- **Fluxo de status** — Aguardando → Confirmado → Preparando → Em Entrega → Entregue
- **Cancelamento** com confirmação
- **Estatísticas do dia** — novos pedidos, em andamento, faturamento

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | Vite + React 18 + TypeScript | SPA estática → GitHub Pages gratuito |
| UI | Tailwind CSS v3 | Utility-first, zero runtime |
| Animações | Framer Motion | Animações de produção para React |
| Backend | Supabase | Auth + PostgreSQL + Realtime + Storage gratuito |
| Estado global | Zustand | Leve, sem boilerplate, persistência fácil |
| Formulários | React Hook Form + Zod | Validação tipada, performance ótima |
| Data fetching | TanStack Query | Cache inteligente, estados automáticos |
| Roteamento | React Router v6 | SPA routing com lazy loading |
| CI/CD | GitHub Actions | Build + deploy automático no push |
| Hosting | GitHub Pages | Gratuito, 100% uptime |

---

## 📁 Estrutura do Projeto

```
magnata-pizza/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build + type-check + deploy
│
├── src/
│   ├── app/
│   │   └── queryClient.ts      # TanStack Query configurado
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   └── OrderDetailModal.tsx   # Modal de pedido (admin)
│   │   ├── auth/
│   │   │   └── AuthModal.tsx          # Login + Cadastro
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx         # Gaveta do carrinho (3 abas)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pizza/
│   │   │   ├── PizzaCard.tsx          # Card do cardápio
│   │   │   ├── ConfigModal.tsx        # Orquestrador (5 passos)
│   │   │   └── steps/
│   │   │       └── index.tsx          # StepTipo, StepTamanho, StepBorda, StepAdicionais, StepResumo
│   │   └── ui/
│   │       ├── index.tsx              # Badge, Spinner, Toast, StepBar, QtyControl, SelectCard, Skeleton
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── OrderStatusBadge.tsx
│   │
│   ├── features/               # Lógica de negócio por domínio
│   │   ├── auth/
│   │   │   └── useAuth.ts             # Hook: sessão, login, register, logout
│   │   ├── catalog/
│   │   │   └── useCatalog.ts          # Queries: pizzas, bordas, extras, config
│   │   ├── orders/
│   │   │   └── useOrders.ts           # Query: pedidos do cliente; Mutation: criar pedido
│   │   └── admin/
│   │       ├── useAdminOrders.ts      # Query: todos os pedidos; Realtime; Mutation: status
│   │       └── useAdminCatalog.ts     # Mutations: toggle pizza, preços, promos, config
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Client singleton
│   │   ├── pricing.ts          # Lógica pura: preços, meio a meio, totais
│   │   └── whatsapp.ts         # Gerador de mensagem + URL
│   │
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero + Catálogo
│   │   ├── DashboardPage.tsx   # Histórico do cliente
│   │   └── AdminPage.tsx       # Painel admin com realtime
│   │
│   ├── store/
│   │   └── cart.ts             # Zustand + localStorage
│   │
│   ├── types/
│   │   └── index.ts            # Todos os tipos TypeScript
│   │
│   ├── utils/
│   │   └── index.ts            # timeAgo, formatDate, uuid, etc.
│   │
│   ├── App.tsx                 # Root: roteamento + providers
│   ├── main.tsx                # Ponto de entrada React
│   └── index.css               # Tailwind + fontes + utilitários
│
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql      # Tabelas, enums, RLS, índices, realtime
│       └── 002_seed.sql        # 40 pizzas + bordas + extras + config padrão
│
├── public/
│   └── favicon.svg
│
├── .env.example                # Template de variáveis (sem segredos)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- Conta no [Supabase](https://supabase.com) (gratuito)

### 1. Clone o repositório
```bash
git clone https://github.com/SEU-USUARIO/magnata-pizza.git
cd magnata-pizza
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

**a) Crie um projeto** em [supabase.com](https://supabase.com)

**b) Execute as migrations** no SQL Editor do Supabase, nesta ordem:
```
supabase/migrations/001_schema.sql
supabase/migrations/002_seed.sql
```

**c) Configure as variáveis de ambiente:**
```bash
cp .env.example .env.local
```

Edite `.env.local` com seus dados do Supabase (`Project Settings > API`):
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_STORE_NAME=Pizzaria MAGNATA
VITE_WHATSAPP_NUMBER=5562999999999
```

### 4. Rode o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:5173/magnata-pizza`

---

## ☁️ Deploy no GitHub Pages (gratuito)

### 1. Crie o repositório no GitHub
```bash
git init
git remote add origin https://github.com/SEU-USUARIO/magnata-pizza.git
git add .
git commit -m "feat: initial commit"
git push -u origin main
```

### 2. Configure os secrets no GitHub
Em `Settings > Secrets and variables > Actions`, adicione:

| Secret | Valor |
|--------|-------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key do Supabase |
| `VITE_STORE_NAME` | `Pizzaria MAGNATA` |
| `VITE_WHATSAPP_NUMBER` | `5562999999999` |

### 3. Ative o GitHub Pages
Em `Settings > Pages`:
- **Source:** `GitHub Actions`

### 4. Faça um push
```bash
git push origin main
```

O GitHub Actions vai **buildar, verificar tipos e publicar** automaticamente.
O site ficará em: `https://SEU-USUARIO.github.io/magnata-pizza`

---

## 👤 Criar Conta Admin

Após criar seu projeto Supabase e executar as migrations:

1. Cadastre-se normalmente no site
2. No Supabase Dashboard, vá em `Table Editor > profiles`
3. Encontre seu usuário e altere o campo `role` de `customer` para `owner`
4. Acesse `/admin` no site — o painel estará disponível

---

## 🗄️ Banco de Dados

### Diagrama de Entidades

```
profiles ──────────────────── orders ──┬── order_items
(auth.users)                           └── order_extras

categories ──┐
             ├── pizzas ──── pizza_prices
             │
bordas ──────┤  (referenciados no pedido como JSON snapshot)
adicionais ──┤
extras ──────┘

system_config   (chave-valor: regras, config visual, PIX, horários)
```

### Regras de Segurança (RLS)
- Clientes veem **apenas seus próprios pedidos**
- Admins veem **todos os pedidos e têm acesso total ao catálogo**
- Catálogo é **público** (sem login para visualizar)
- Preços e config são **somente admin** para escrita

---

## ⚙️ Configurações do Admin (via Supabase)

Edite diretamente na tabela `system_config`:

| Chave | Descrição | Exemplo |
|-------|-----------|---------|
| `half_half_rule` | Regra meio a meio | `"max"` ou `"avg"` |
| `store_open` | Loja aberta/fechada | `true` |
| `hero_image_url` | Foto do hero | `"https://..."` |
| `pix_key` | Chave Pix | `"email@chave.com"` |
| `store_phone` | Telefone exibido | `"(62) 9 9999-9999"` |
| `opening_hours` | Horários | `{"qui":"18:00-23:00"}` |

---

## 📱 Mensagem WhatsApp (Gerada Automaticamente)

```
Olá João! Aqui é da Pizzaria MAGNATA 🍕

✅ Pedido #1042 Confirmado!

Itens:
• 1x Calabresa / Frango Barbecue (G) + Borda Especial (Mussarela) — R$ 75,00
• 1x Brigadeiro (M) — R$ 50,00

Extras:
• 1x Coca-Cola Original 2L — R$ 15,00

Total: R$ 140,00

📍 Entrega: Rua das Flores, 123 — Setor Bueno
📌 Referência: Próximo ao Extra

Por favor, confirme a forma de pagamento ou envie o comprovante do Pix. 😊
```

---

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build local
npm run type-check   # Verificação de tipos TypeScript
npm run lint         # ESLint
```

---

## 📦 Plano Free — Limites do Supabase

| Recurso | Limite gratuito |
|---------|----------------|
| Banco de dados | 500 MB |
| Requisições/mês | 50.000 |
| Realtime | 200 conexões simultâneas |
| Storage | 1 GB |
| Auth | Usuários ilimitados |

Para uma pizzaria pequena a média, o plano free é **mais que suficiente**.

---

## 🗺️ Roadmap Futuro

- [ ] **PWA** — instalável no celular com notificações push
- [ ] **Programa de fidelidade** — pontos por pedido
- [ ] **Cupons de desconto** — admin cria % ou valor fixo
- [ ] **Rastreamento** — status atualizado por SMS/WhatsApp automático
- [ ] **Relatórios** — gráficos de vendas, horário de pico, sabores mais pedidos
- [ ] **Upload de imagens** — admin adiciona foto para cada pizza via Supabase Storage
- [ ] **Página admin de catálogo** — CRUD completo pelo painel (sem SQL Editor)

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para a **Pizzaria MAGNATA**.

---

<div align="center">
  <strong>🍕 Feito com carinho para a Pizzaria MAGNATA · Goiânia — GO</strong>
</div>
