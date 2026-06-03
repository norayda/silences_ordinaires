-- ============================================================
-- Silences Ordinaires — Table settings (page À propos admin)
-- À exécuter dans le SQL Editor après supabase_schema.sql
-- ============================================================

create table if not exists settings (
  key   text primary key,
  value text not null default ''
);

alter table settings enable row level security;

-- Lecture publique
create policy "settings_public_select"
  on settings for select
  to anon, authenticated
  using (true);

-- Écriture réservée aux admins
create policy "settings_auth_all"
  on settings for all
  to authenticated
  using (true)
  with check (true);

-- Valeurs initiales
insert into settings (key, value) values
  ('author_name', ''),
  ('author_bio', ''),
  ('author_image_url', '')
on conflict (key) do nothing;
