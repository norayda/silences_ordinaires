-- ============================================================
-- Silences Ordinaires — Schéma Supabase complet
-- Résidence Massamba-Débat, 2 rue Théophile Obenga
-- ============================================================

-- ============================================================
-- Tables
-- ============================================================

create table if not exists posts (
  id          uuid        default gen_random_uuid() primary key,
  title       text        not null,
  slug        text        unique not null,
  content     text        not null default '',
  excerpt     text,
  cover_url   text,
  category    text,
  published   boolean     default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Migration si la table existe déjà
alter table posts add column if not exists category text;

create table if not exists comments (
  id          uuid        default gen_random_uuid() primary key,
  post_id     uuid        references posts(id) on delete cascade not null,
  author_name text        not null,
  content     text        not null,
  approved    boolean     default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- Storage
-- ============================================================

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table posts    enable row level security;
alter table comments enable row level security;

-- Posts : lecture publique des articles publiés
create policy "posts_anon_select"
  on posts for select
  to anon
  using (published = true);

-- Posts : accès complet pour les utilisateurs authentifiés (admin)
create policy "posts_auth_all"
  on posts for all
  to authenticated
  using (true)
  with check (true);

-- Comments : lecture publique des commentaires approuvés
create policy "comments_anon_select"
  on comments for select
  to anon
  using (approved = true);

-- Comments : les visiteurs peuvent créer des commentaires (non approuvés)
create policy "comments_anon_insert"
  on comments for insert
  to anon
  with check (approved = false);

-- Comments : accès complet pour les utilisateurs authentifiés (admin)
create policy "comments_auth_all"
  on comments for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Storage policies
-- ============================================================

drop policy if exists "covers_public_select" on storage.objects;
drop policy if exists "covers_auth_insert"   on storage.objects;
drop policy if exists "covers_auth_update"   on storage.objects;
drop policy if exists "covers_auth_delete"   on storage.objects;

create policy "covers_public_select"
  on storage.objects for select
  to public
  using (bucket_id = 'covers');

create policy "covers_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'covers');

create policy "covers_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'covers');

create policy "covers_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'covers');

-- ============================================================
-- Triggers
-- ============================================================

create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_updated_at on posts;
create trigger posts_updated_at
  before update on posts
  for each row execute function handle_updated_at();

-- ============================================================
-- Index
-- ============================================================

create index if not exists posts_slug_idx
  on posts(slug);

create index if not exists posts_published_created_idx
  on posts(published, created_at desc);

create index if not exists comments_post_id_idx
  on comments(post_id);

create index if not exists comments_approved_idx
  on comments(approved, created_at desc);
