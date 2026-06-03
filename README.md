# Silences Ordinaires

Blog littéraire couplé à un module IA interactif, accompagnant le roman sur les solitudes invisibles de la Résidence Massamba-Débat.

**Stack :** Next.js 14 · TypeScript · Tailwind CSS · Supabase · Tiptap · Anthropic Claude · Vercel

---

## Prérequis

- Node.js 18+
- Compte [Supabase](https://supabase.com)
- Compte [Vercel](https://vercel.com)
- Clé API [Anthropic](https://console.anthropic.com)

---

## Installation locale

```bash
# 1. Cloner et installer les dépendances
git clone <repo-url> silences-ordinaires
cd silences-ordinaires
npm install

# 2. Copier les variables d'environnement
cp .env.local.example .env.local
# Remplir les valeurs dans .env.local

# 3. Lancer en développement
npm run dev
```

---

## Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur [app.supabase.com](https://app.supabase.com) → New Project
2. Choisir un nom (ex: `silences-ordinaires`), une région proche (Europe West)
3. Récupérer dans **Settings → API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Appliquer le schéma

Dans **SQL Editor** de Supabase, coller et exécuter le contenu de `supabase_schema.sql`.

### 3. Créer le compte admin

Dans **Authentication → Users**, cliquer sur **Invite user** ou **Add user** et créer un compte avec votre email.

---

## Déploiement Vercel

### 1. Importer le projet

```bash
# Option A : via CLI Vercel
npm i -g vercel
vercel

# Option B : via l'interface web
# Aller sur vercel.com → New Project → importer depuis GitHub
```

### 2. Configurer les variables d'environnement

Dans **Vercel → Project → Settings → Environment Variables**, ajouter :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `ANTHROPIC_API_KEY` | Clé API Anthropic |

### 3. Déployer

```bash
vercel --prod
```

---

## Domaine custom (silencesordinaires.fr)

### Via Vercel

1. **Vercel → Project → Settings → Domains**
2. Ajouter `silencesordinaires.fr` et `www.silencesordinaires.fr`
3. Copier les enregistrements DNS fournis

### Configuration DNS (chez votre registrar)

| Type | Nom | Valeur |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Propagation : 15 min à 48h selon le registrar.

---

## Structure du projet

```
src/
├── app/
│   ├── (public)/          # Pages publiques avec header/footer
│   │   ├── page.tsx       # Accueil — liste des articles
│   │   ├── blog/[slug]/   # Article individuel
│   │   ├── appartements/  # Module IA interactif
│   │   └── a-propos/      # Page statique auteure
│   ├── admin/             # Back-office protégé
│   │   ├── login/         # Authentification
│   │   ├── page.tsx       # Dashboard
│   │   ├── nouveau/       # Créer un article
│   │   └── editer/[id]/   # Modifier un article
│   └── api/
│       ├── appartements/  # Appel Claude API
│       └── comments/      # Soumission commentaires
├── components/            # Composants réutilisables
├── lib/supabase/          # Clients Supabase (browser + server)
└── types/                 # Types TypeScript partagés
```

---

## Pages

| URL | Description |
|---|---|
| `/` | Accueil avec liste des articles publiés |
| `/blog/[slug]` | Article individuel avec commentaires |
| `/appartements` | Module IA — association prénom/appartement |
| `/a-propos` | Présentation de l'auteure et du roman |
| `/admin` | Dashboard admin (protégé) |
| `/admin/login` | Connexion admin |
| `/admin/nouveau` | Créer un article |
| `/admin/editer/[id]` | Modifier un article |

---

## Sécurité

- L'accès `/admin/*` est protégé par middleware Supabase Auth
- Les RLS Supabase garantissent que les anonymes ne lisent que les articles publiés et commentaires approuvés
- Le Penthouse (Apt 4 / Chapitre 7) est exclu au niveau du prompt système ET vérifié côté serveur
- Tous les inputs sont sanitisés avant insertion en base

---

## Lien 3114

Le numéro national de prévention du suicide (3114) apparaît en pied de page de chaque article publié, conformément à la mission de sensibilisation du projet.
