# ✅ Railway - Connexion établie

## Statut actuel

### ✅ Connexion Railway
- **Projet:** Onyx Pay (ID: `36240464-06f3-43dc-899c-99f113d9c4cd`)
- **Environnement:** production (ID: `a29d52e4-fb3c-4f02-804c-76664032720b`)
- **URL:** https://onyx-pay-production.up.railway.app
- **Statut:** Déployé mais erreur 500

### ❌ Problème actuel
L'application retourne une **erreur 500** car il manque:
1. La base de données PostgreSQL
2. Les variables d'environnement nécessaires

## Actions à faire manuellement (Dashboard Railway)

### 1. Ajouter PostgreSQL

1. Aller sur https://railway.app/project/36240464-06f3-43dc-899c-99f113d9c4cd
2. Cliquer sur **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway va créer automatiquement la base et la variable `DATABASE_URL`

### 2. Configurer les variables d'environnement

Dans l'onglet **"Variables"** du service Next.js, ajouter:

```env
# NEXTAUTH_URL (IMPORTANT: utiliser l'URL Railway)
NEXTAUTH_URL=https://onyx-pay-production.up.railway.app

# NEXTAUTH_SECRET (générer un nouveau secret sécurisé)
NEXTAUTH_SECRET=<générer avec: openssl rand -base64 32>

# NODE_ENV
NODE_ENV=production
```

**Générer NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Redéployer

Une fois les variables ajoutées, Railway redéploiera automatiquement.

### 4. Créer l'utilisateur admin

Une fois le déploiement réussi, créer l'admin via SQL:

1. Aller dans l'onglet **"Data"** de PostgreSQL
2. Ouvrir **"Query"**
3. Exécuter:

```sql
-- Hash bcrypt pour "onyx2025"
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

## Vérification finale

1. Ouvrir https://onyx-pay-production.up.railway.app
2. Aller sur `/login`
3. Se connecter avec les credentials admin
4. Vérifier que le dashboard s'affiche

## Commandes Railway CLI disponibles

```bash
# Voir le statut
railway status

# Voir les logs (une fois le service lié)
railway logs

# Voir les variables
railway variables

# Ouvrir le dashboard
open https://railway.app/project/36240464-06f3-43dc-899c-99f113d9c4cd
```

## Configuration actuelle

```json
{
  "projectId": "36240464-06f3-43dc-899c-99f113d9c4cd",
  "environmentId": "a29d52e4-fb3c-4f02-804c-76664032720b",
  "url": "https://onyx-pay-production.up.railway.app"
}
```

## Prochaines étapes

1. ✅ Connexion Railway établie
2. ⏳ Ajouter PostgreSQL (via dashboard)
3. ⏳ Configurer NEXTAUTH_SECRET (via dashboard)
4. ⏳ Attendre redéploiement automatique
5. ⏳ Créer utilisateur admin
6. ⏳ Tester l'application

---

**Note:** Le Railway CLI nécessite une interaction TTY pour certaines commandes. Utilisez le dashboard web pour ajouter des services et configurer les variables.
