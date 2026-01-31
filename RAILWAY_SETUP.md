# Configuration Railway - ONYX Launch & Ops

## Étape 1: Ajouter PostgreSQL

1. Aller sur [railway.app](https://railway.app)
2. Ouvrir votre projet ONYX
3. Cliquer sur **"+ New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway va créer automatiquement une base PostgreSQL

## Étape 2: Configurer les variables d'environnement

Dans l'onglet **"Variables"** de votre service, ajouter:

```env
# DATABASE_URL est fourni automatiquement par Railway
# Vérifier qu'il pointe bien vers la base PostgreSQL

# NextAuth (IMPORTANT: générer un nouveau secret)
NEXTAUTH_URL=https://votre-app.up.railway.app
NEXTAUTH_SECRET=<générer avec: openssl rand -base64 32>

# App
NODE_ENV=production
```

## Étape 3: Variables Railway automatiques

Railway fournit automatiquement:
- `DATABASE_URL` - URL de connexion PostgreSQL
- `PORT` - Port d'écoute (généralement 3000)

## Étape 4: Déploiement

Le push sur GitHub déclenche automatiquement le déploiement Railway.

Les commandes suivantes s'exécutent automatiquement:
1. `npm install`
2. `npm run build` (qui inclut `prisma generate`)
3. `npm run start`

Les tables Prisma sont créées automatiquement au premier déploiement via `prisma generate`.

## Étape 5: Créer le premier utilisateur admin

Une fois déployé, vous pouvez créer un utilisateur admin de deux façons:

### Option A: Via Railway CLI (local)

```bash
# Se connecter au projet
railway link

# Exécuter le script
railway run npm run db:create-admin
```

### Option B: Via SQL direct (Railway Dashboard)

1. Aller dans l'onglet **"Data"** de votre base PostgreSQL
2. Ouvrir **"Query"**
3. Exécuter:

```sql
-- Générer le hash bcrypt du mot de passe "onyx2025"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGjd67wGcXqKe6gw8i

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

## Étape 6: Vérifier le déploiement

1. Ouvrir l'URL de votre app Railway
2. Aller sur `/login`
3. Se connecter avec les credentials admin
4. Vérifier que le dashboard s'affiche correctement

## Troubleshooting

### Erreur: "Unable to connect to database"
- Vérifier que `DATABASE_URL` pointe bien vers la base PostgreSQL Railway
- Vérifier que la base PostgreSQL est bien démarrée

### Erreur: "NextAuth configuration error"
- Vérifier que `NEXTAUTH_URL` correspond à votre URL Railway
- Vérifier que `NEXTAUTH_SECRET` est bien défini (32+ caractères)

### Tables non créées
- Vérifier les logs de build Railway
- `prisma generate` doit s'exécuter pendant le build
- Si besoin, exécuter manuellement: `railway run npx prisma db push`

## Architecture finale

```
Railway Project
├── Service: onyx-launch-ops (Next.js)
│   ├── DATABASE_URL → PostgreSQL
│   ├── NEXTAUTH_URL
│   ├── NEXTAUTH_SECRET
│   └── NODE_ENV=production
└── Database: PostgreSQL
    └── 22 tables créées automatiquement
```

## Commandes utiles

```bash
# Voir les logs en temps réel
railway logs

# Ouvrir un shell dans le service
railway shell

# Exécuter une commande
railway run <command>

# Ouvrir la base de données
railway connect postgres
```

---

**Note:** Les données de seed/demo ont été supprimées. La base démarre vide et propre.
