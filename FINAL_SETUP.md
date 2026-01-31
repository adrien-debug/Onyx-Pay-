# 🎯 Configuration finale - ONYX sur Railway + Supabase

## Situation actuelle

✅ **Complété:**
- Application déployée sur Railway
- Variables configurées (NEXTAUTH_URL, NEXTAUTH_SECRET)
- Build réussi
- Page login accessible

⚠️ **Manque:** Base de données PostgreSQL

## Solution: Utiliser Supabase PostgreSQL

Vous avez déjà une base Supabase: `db.hbskygrswvjouqvmowlo.supabase.co`

### Étape 1: Récupérer l'URL de connexion Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet
3. Aller dans **Settings** → **Database**
4. Copier la **Connection string** (mode `URI`)

Elle devrait ressembler à:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.hbskygrswvjouqvmowlo.supabase.co:5432/postgres
```

### Étape 2: Configurer Railway avec Supabase

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"

# Remplacer [PASSWORD] par votre vrai mot de passe Supabase
railway variables --set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.hbskygrswvjouqvmowlo.supabase.co:5432/postgres?schema=onyx"
```

**Note:** J'ai ajouté `?schema=onyx` pour isoler les tables ONYX des autres projets.

### Étape 3: Créer les tables (automatique)

Railway va automatiquement redéployer et Prisma va créer les tables au démarrage via `prisma generate`.

**OU** créer les tables manuellement:

```bash
# Se connecter à Supabase
psql -h db.hbskygrswvjouqvmowlo.supabase.co -p 5432 -d postgres -U postgres

# Créer le schéma onyx (déjà fait ✅)
CREATE SCHEMA IF NOT EXISTS onyx;

# Exécuter la migration
\i /tmp/onyx-migration.sql
```

### Étape 4: Créer l'utilisateur admin

Une fois les tables créées:

**Option A: Via Railway CLI**
```bash
railway run npm run db:create-admin
```

**Option B: Via SQL (Supabase Dashboard)**
```sql
-- Se connecter au schéma onyx
SET search_path TO onyx;

-- Créer l'admin
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-' || substr(md5(random()::text), 1, 20),
  'admin@onyx.com',
  'Admin ONYX',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGjd67wGcXqKe6gw8i',
  'ADMIN',
  NOW(),
  NOW()
);
```

**Credentials:**
- Email: `admin@onyx.com`
- Password: `onyx2025`

### Étape 5: Tester l'application

1. Ouvrir https://onyx-pay-production.up.railway.app
2. Se connecter avec les credentials admin
3. Vérifier que le dashboard s'affiche

## Commande rapide (tout-en-un)

Si vous avez le mot de passe Supabase:

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"

# 1. Configurer DATABASE_URL
railway variables --set DATABASE_URL="postgresql://postgres:VOTRE_PASSWORD@db.hbskygrswvjouqvmowlo.supabase.co:5432/postgres?schema=onyx"

# 2. Attendre le redéploiement (2-3 min)
railway logs --deployment

# 3. Créer l'admin
railway run npm run db:create-admin

# 4. Tester
open https://onyx-pay-production.up.railway.app
```

## Schéma d'architecture

```
Railway (Next.js App)
    ↓ DATABASE_URL
Supabase PostgreSQL
    ├── Schema: public (autres projets)
    └── Schema: onyx (ONYX Launch & Ops) ✅
        ├── users
        ├── projects
        ├── tasks
        ├── milestones
        ├── risks
        └── ... (22 tables)
```

## Troubleshooting

### Erreur: "schema onyx does not exist"
```sql
CREATE SCHEMA IF NOT EXISTS onyx;
```

### Erreur: "relation users does not exist"
Les tables n'ont pas été créées. Exécuter manuellement:
```bash
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"
DATABASE_URL="postgresql://postgres:PASSWORD@db.hbskygrswvjouqvmowlo.supabase.co:5432/postgres?schema=onyx" npx prisma db push
```

### Vérifier les tables créées
```sql
SET search_path TO onyx;
\dt
```

---

**Note:** Le schéma `onyx` a déjà été créé sur Supabase. Il ne reste plus qu'à configurer Railway avec l'URL de connexion.
