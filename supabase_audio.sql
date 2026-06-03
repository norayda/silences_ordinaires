-- ============================================================
-- Silences Ordinaires — Bucket audio + colonne audio_url
-- À exécuter dans le SQL Editor
-- ============================================================

-- Colonne audio_url sur posts
alter table posts add column if not exists audio_url text;

-- Bucket audio public
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true)
on conflict (id) do nothing;

-- Policies storage audio
drop policy if exists "audio_public_select" on storage.objects;
drop policy if exists "audio_auth_insert"   on storage.objects;
drop policy if exists "audio_auth_update"   on storage.objects;
drop policy if exists "audio_auth_delete"   on storage.objects;

create policy "audio_public_select"
  on storage.objects for select to public
  using (bucket_id = 'audio');

create policy "audio_auth_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'audio');

create policy "audio_auth_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'audio');

create policy "audio_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'audio');
