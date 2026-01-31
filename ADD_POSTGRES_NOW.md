# ⚡ AJOUTER POSTGRESQL MAINTENANT - 2 MINUTES

Le dashboard Railway est ouvert dans votre navigateur.

## Action immédiate (30 secondes)

1. **Cliquer sur le bouton "+ New"** (en haut à droite)
2. **Sélectionner "Database"**
3. **Choisir "Add PostgreSQL"**
4. **Attendre 10 secondes** que Railway crée la base

✅ **C'EST TOUT!** Railway va automatiquement:
- Créer la base PostgreSQL
- Ajouter la variable `DATABASE_URL`
- Redéployer l'application
- Prisma créera les tables au démarrage

## Ensuite (1 minute)

Une fois le redéploiement terminé (2-3 min):

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"
railway run npm run db:create-admin
```

**Credentials:**
- Email: `admin@onyx.com`
- Password: `onyx2025`

## Tester

Ouvrir: https://onyx-pay-production.up.railway.app

---

**Note:** Si vous préférez utiliser Supabase au lieu de Railway PostgreSQL, donnez-moi le mot de passe Supabase et je configure immédiatement.
