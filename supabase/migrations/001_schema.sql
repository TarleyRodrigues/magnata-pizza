-- ============================================================
-- PIZZARIA MAGNATA — Migration 001: Schema Completo
-- Execute no Supabase SQL Editor em ordem
-- ============================================================

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
create type user_role      as enum ('customer', 'admin', 'owner');
create type pizza_size     as enum ('P', 'M', 'G');
create type pizza_tier     as enum ('standard', 'especial', 'premium', 'ultra', 'doce');
create type extra_type     as enum ('bebida', 'molho');
create type order_status   as enum ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled');
create type half_half_rule as enum ('max', 'avg');

-- ─────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
create table profiles (
  id           uuid primary key references auth.users on delete cascade,
  name         text        not null,
  phone        text        not null,
  address      text        not null,
  address_ref  text,
  role         user_role   not null default 'customer',
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
create table categories (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null,
  slug         text        not null unique,
  description  text,
  display_order int        not null default 0,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- PIZZAS
-- ─────────────────────────────────────────────
create table pizzas (
  id             uuid        primary key default uuid_generate_v4(),
  category_id    uuid        not null references categories on delete restrict,
  name           text        not null,
  description    text        not null,
  tier           pizza_tier  not null default 'standard',
  is_promotional boolean     not null default false,
  -- Tamanhos permitidos (null = todos; ex: '{"G"}' para promo)
  allowed_sizes  pizza_size[] not null default array['P','M','G']::pizza_size[],
  is_spicy       boolean     not null default false,
  is_available   boolean     not null default true,
  image_url      text,
  display_order  int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger pizzas_updated_at
  before update on pizzas
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
-- PIZZA PRICES
-- ─────────────────────────────────────────────
create table pizza_prices (
  id       uuid        primary key default uuid_generate_v4(),
  pizza_id uuid        not null references pizzas on delete cascade,
  size     pizza_size  not null,
  price    numeric(10,2) not null check (price > 0),
  unique (pizza_id, size)
);

-- ─────────────────────────────────────────────
-- BORDAS
-- ─────────────────────────────────────────────
create table bordas (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null,
  price        numeric(10,2) not null default 0,
  flavors      text[]      not null default '{}',
  is_available boolean     not null default true,
  display_order int        not null default 0
);

-- ─────────────────────────────────────────────
-- ADICIONAIS (ingredientes extras na pizza)
-- ─────────────────────────────────────────────
create table adicionais (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null,
  price        numeric(10,2) not null check (price >= 0),
  is_available boolean     not null default true,
  display_order int        not null default 0
);

-- ─────────────────────────────────────────────
-- EXTRAS (bebidas e molhos — fora da pizza)
-- ─────────────────────────────────────────────
create table extras (
  id           uuid        primary key default uuid_generate_v4(),
  name         text        not null,
  type         extra_type  not null,
  price        numeric(10,2) not null check (price >= 0),
  is_available boolean     not null default true,
  display_order int        not null default 0
);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
create sequence order_number_seq start 1000;

create table orders (
  id               uuid         primary key default uuid_generate_v4(),
  number           int          not null default nextval('order_number_seq'),
  user_id          uuid         not null references auth.users on delete restrict,
  status           order_status not null default 'pending',
  pay_method       text,
  subtotal         numeric(10,2) not null,
  total            numeric(10,2) not null,
  notes            text,
  -- Snapshot do endereço no momento do pedido
  delivery_address text         not null,
  delivery_ref     text,
  delivery_phone   text         not null,
  delivery_name    text         not null,
  -- Timestamps por status
  confirmed_at     timestamptz,
  preparing_at     timestamptz,
  delivering_at    timestamptz,
  delivered_at     timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz  not null default now(),
  updated_at       timestamptz  not null default now()
);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Index para fila de pedidos (admin busca por status + data)
create index idx_orders_status_created on orders (status, created_at desc);
create index idx_orders_user_id        on orders (user_id, created_at desc);

-- ─────────────────────────────────────────────
-- ORDER ITEMS (pizzas do pedido)
-- ─────────────────────────────────────────────
create table order_items (
  id              uuid       primary key default uuid_generate_v4(),
  order_id        uuid       not null references orders on delete cascade,
  -- Snapshot dos dados (imutável mesmo se pizza for editada depois)
  pizza_name      text       not null,   -- "Calabresa" ou "Calabresa / Frango Barbecue"
  is_half_half    boolean    not null default false,
  size            pizza_size not null,
  qty             int        not null default 1 check (qty > 0),
  unit_price      numeric(10,2) not null,
  total_price     numeric(10,2) not null,
  -- Borda (snapshot)
  borda_name      text,
  borda_flavor    text,
  borda_price     numeric(10,2),
  -- Adicionais como JSON snapshot
  adicionais_json jsonb      not null default '[]'
);

create index idx_order_items_order on order_items (order_id);

-- ─────────────────────────────────────────────
-- ORDER EXTRAS (bebidas e molhos do pedido)
-- ─────────────────────────────────────────────
create table order_extras (
  id          uuid       primary key default uuid_generate_v4(),
  order_id    uuid       not null references orders on delete cascade,
  extra_name  text       not null,
  extra_type  extra_type not null,
  qty         int        not null default 1 check (qty > 0),
  unit_price  numeric(10,2) not null,
  total_price numeric(10,2) not null
);

create index idx_order_extras_order on order_extras (order_id);

-- ─────────────────────────────────────────────
-- SYSTEM CONFIG (CMS para admin)
-- ─────────────────────────────────────────────
create table system_config (
  key        text primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now(),
  updated_by uuid        references auth.users
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- PROFILES
alter table profiles enable row level security;

create policy "profiles_select_own"   on profiles for select using (auth.uid() = id);
create policy "profiles_update_own"   on profiles for update using (auth.uid() = id);
create policy "profiles_select_admin" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','owner'))
);

-- Função helper para checar role
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('admin','owner')
  );
$$;

-- CATEGORIES (público para leitura)
alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (is_active = true);
create policy "categories_admin_all"   on categories for all  using (is_admin());

-- PIZZAS (público para leitura)
alter table pizzas enable row level security;
create policy "pizzas_public_read" on pizzas for select using (is_available = true);
create policy "pizzas_admin_all"   on pizzas for all  using (is_admin());

-- PIZZA PRICES (público)
alter table pizza_prices enable row level security;
create policy "prices_public_read" on pizza_prices for select using (true);
create policy "prices_admin_all"   on pizza_prices for all using (is_admin());

-- BORDAS (público)
alter table bordas enable row level security;
create policy "bordas_public_read" on bordas for select using (is_available = true);
create policy "bordas_admin_all"   on bordas for all using (is_admin());

-- ADICIONAIS (público)
alter table adicionais enable row level security;
create policy "adicionais_public_read" on adicionais for select using (is_available = true);
create policy "adicionais_admin_all"   on adicionais for all using (is_admin());

-- EXTRAS (público)
alter table extras enable row level security;
create policy "extras_public_read" on extras for select using (is_available = true);
create policy "extras_admin_all"   on extras for all using (is_admin());

-- ORDERS
alter table orders enable row level security;
create policy "orders_select_own"   on orders for select using (auth.uid() = user_id);
create policy "orders_insert_own"   on orders for insert with check (auth.uid() = user_id);
create policy "orders_admin_all"    on orders for all   using (is_admin());

-- ORDER ITEMS
alter table order_items enable row level security;
create policy "items_select_own" on order_items for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "items_insert_own" on order_items for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "items_admin_all"  on order_items for all using (is_admin());

-- ORDER EXTRAS
alter table order_extras enable row level security;
create policy "extras_select_own" on order_extras for select using (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "extras_insert_own" on order_extras for insert with check (
  exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
);
create policy "extras_admin_all"  on order_extras for all using (is_admin());

-- SYSTEM CONFIG
alter table system_config enable row level security;
create policy "config_public_read" on system_config for select using (true);
create policy "config_admin_all"   on system_config for all using (is_admin());

-- ─────────────────────────────────────────────
-- REALTIME (habilitar para painel admin)
-- ─────────────────────────────────────────────
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
