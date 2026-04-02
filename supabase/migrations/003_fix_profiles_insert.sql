-- ============================================================
-- PIZZARIA MAGNATA — Migration 003: Corrige criação de perfil
-- Execute no Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Política INSERT para profiles
--    (sem isso, mesmo com sessão ativa o insert falhava)
-- ─────────────────────────────────────────────
create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 2. Trigger que cria o perfil automaticamente
--    quando um novo usuário é criado no auth.users.
--    Usa SECURITY DEFINER para contornar o RLS.
--    Lê os dados de raw_user_meta_data (enviados pelo signUp).
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone, address, address_ref)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name',        'Usuário'),
    coalesce(new.raw_user_meta_data->>'phone',       ''),
    coalesce(new.raw_user_meta_data->>'address',     ''),
    new.raw_user_meta_data->>'address_ref'
  )
  on conflict (id) do nothing;  -- evita duplicata se já foi inserido pelo client
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
