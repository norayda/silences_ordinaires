-- ============================================================
-- Silences Ordinaires — Nettoyage complet
-- Exécuter AVANT supabase_schema.sql
-- ============================================================

-- ── Tables (au cas où il en resterait des fragments) ────────
drop table if exists comments cascade;
drop table if exists posts    cascade;

-- ── Fonction trigger ────────────────────────────────────────
drop function if exists handle_updated_at() cascade;

-- ── Storage ──────────────────────────────────────────────────
-- Les policies et le bucket doivent être supprimés via l'interface Supabase :
-- Storage → covers → ⋯ → Delete bucket
-- (Supabase bloque la suppression directe via SQL)
