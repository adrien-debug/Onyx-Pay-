# ONYX Launch & Ops

Plateforme interne de project management et launch ops pour le lancement ONYX à Dubaï (Septembre 2025).

## Fonctionnalités Complètes

### Dashboard
- KPIs en temps réel (tâches, bloquants, retards)
- Progression globale du lancement
- Prochaines actions prioritaires
- Registre des risques avec scores

### Projects (CRUD complet)
- Création, modification, suppression de projets
- Page de détail avec statistiques complètes
- Gestion des workstreams par projet
- Vue d'ensemble avec progression et statistiques
- Suivi des jalons et tâches par projet
- Liens rapides vers Tasks, Roadmap, Risks

### Tasks (CRUD complet)
- Création, modification, suppression de tâches
- Filtres par statut, priorité, workstream, assigné
- Table triable et interactive
- Checklist, commentaires, pièces jointes

### Roadmap & Milestones (CRUD complet)
- Timeline visuelle des jalons
- Création, modification, suppression de jalons
- Marquage terminé/non terminé
- Vue par semaine jusqu'à Septembre

### Risks (CRUD complet)
- Matrice des risques 5x5 (Probabilité × Impact)
- Création, modification, suppression de risques
- Mise à jour du statut en ligne
- Plan de mitigation

### Hardware Research Hub (CRUD complet)
- Évaluation des devices Android (score, specs, contraintes)
- Sélection Primary/Backup en un clic
- Création, modification, suppression de devices
- Design des accessoires (coques, supports)

### Legal & Contract Pack (CRUD complet)
- Documents juridiques (MSA, SLA, DPA, Terms)
- Workflow de statut (Draft → Review → Approved → Signed)
- Création, modification, suppression de documents
- Note sur le modèle white-label régulé

### Pricing & Packaging (CRUD complet)
- 3 plans: PILOT, PREMIUM, ENTERPRISE
- Activation/désactivation des plans
- Création, modification, suppression de plans
- Inclusions configurables
- Générateur de one-pager (PDF)

### Reward System (CRUD complet)
- Règles d'incentive (per tx, per volume, adoption)
- Simulateur de calcul interactif
- Activation/désactivation des règles
- Plafonds daily/monthly
- Conditions anti-abus

### Content Scanner
- Ingestion de contenu HTML (Webflow, site web)
- Extraction automatique (H1, H2, CTAs, paragraphes)
- Génération de propositions markdown
- Sauvegarde en base de données
- Historique des contenus analysés

### Ops Kit (Runbooks)
- Procédures opérationnelles
- Checklists d'installation venue
- Guide d'incident
- Matrice d'escalation

## Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Auth**: NextAuth (Credentials + RBAC)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma 5
- **Validation**: Zod
- **Forms**: react-hook-form
- **Icons**: lucide-react

## Installation

```bash
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.production.example .env
# Éditer .env avec vos vraies valeurs (DATABASE_URL, NEXTAUTH_SECRET, etc.)

# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push
```

## Lancement

```bash
npm run dev
```

L'application est disponible sur **http://localhost:3000**

## Premier utilisateur

Créez un utilisateur admin avec la commande :

```bash
npm run db:create-admin
```

**Credentials par défaut:**
- Email: `admin@onyx.com`
- Password: `onyx2025`
- Rôle: ADMIN

Vous pouvez personnaliser via les variables d'environnement :
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

**Note:** Les données de seed/demo ont été supprimées. La base démarre vide et propre.

## Structure du projet

```
onyx-launch-ops/
├── prisma/
│   ├── schema.prisma      # Modèles de données
│   └── migrations/        # Migrations de base de données
├── src/
│   ├── app/
│   │   ├── (dashboard)/   # Pages authentifiées
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── projects/
│   │   │   ├── roadmap/
│   │   │   ├── risks/
│   │   │   ├── hardware/
│   │   │   ├── legal/
│   │   │   ├── pricing/
│   │   │   ├── rewards/
│   │   │   ├── content/
│   │   │   ├── ops/
│   │   │   └── settings/
│   │   ├── api/           # API Routes
│   │   │   ├── auth/
│   │   │   ├── hardware/
│   │   │   ├── legal/
│   │   │   ├── pricing/
│   │   │   ├── rewards/
│   │   │   └── content/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── forms/         # Formulaires CRUD
│   │   │   ├── task-form.tsx
│   │   │   ├── milestone-form.tsx
│   │   │   ├── hardware-form.tsx
│   │   │   ├── legal-form.tsx
│   │   │   ├── pricing-form.tsx
│   │   │   ├── reward-form.tsx
│   │   │   └── risk-form.tsx
│   │   ├── layout/        # AppShell, Sidebar, Topbar
│   │   └── ui/            # Composants UI
│   ├── lib/
│   │   ├── actions/       # Server Actions (CRUD)
│   │   │   ├── tasks.ts
│   │   │   ├── milestones.ts
│   │   │   ├── hardware.ts
│   │   │   ├── legal.ts
│   │   │   ├── pricing.ts
│   │   │   ├── rewards.ts
│   │   │   ├── risks.ts
│   │   │   └── content.ts
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   └── types/
└── package.json
```

## Design System ONYX

- **Fond**: Noir (#000000)
- **Accent cuivre**: #D48961
- **Brun**: #8D5E4D
- **Crème**: #FFF2EE

Style premium, glass effects, gradients luxe.

## Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Start production
npm run lint         # Linting
npm run db:generate  # Générer client Prisma
npm run db:push      # Push schema vers DB
npm run db:migrate   # Créer une migration
npm run db:studio    # Interface Prisma Studio
```

## Déploiement sur Railway

1. **Ajouter PostgreSQL** dans votre projet Railway
2. **Copier DATABASE_URL** depuis les variables Railway
3. **Configurer les variables d'environnement** dans Railway:
   - `DATABASE_URL` (fourni automatiquement par Railway)
   - `NEXTAUTH_URL` (votre URL de production)
   - `NEXTAUTH_SECRET` (générer avec `openssl rand -base64 32`)
   - `NODE_ENV=production`

4. **Pousser vers GitHub** - Railway déploiera automatiquement

Les migrations Prisma s'exécutent automatiquement au build via `prisma generate`.

## Note importante

ONYX est un fournisseur tech + hardware. Les services de paiement/crypto sont fournis en white-label par un partenaire régulé (VARA Dubai + PSAN Europe + EMI Irlande). ONYX n'est pas l'entité régulée.

---

**ONYX - Powering the next era of digital payments**

Dubai Launch - Septembre 2025
