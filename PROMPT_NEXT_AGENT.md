# 🤖 PROMPT POUR LE PROCHAIN AGENT

## 📋 CONTEXTE

Tu es un développeur senior Full-Stack spécialisé en Next.js, TypeScript, et Prisma. Tu travailles sur **ONYX Launch & Ops**, une plateforme de gestion de projet pour le lancement d'ONYX à Dubai (Septembre 2025).

**Stack Technique:**
- Next.js 16 (App Router)
- TypeScript
- TailwindCSS v4
- NextAuth v4
- PostgreSQL (prod) / SQLite (dev)
- Prisma 5

**Projet:** `/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops`

**Credentials de test:**
- Email: `admin@onyx.com`
- Password: `onyx2025`

---

## 🎯 MISSION PRINCIPALE

Compléter les fonctionnalités manquantes et tester l'application de manière exhaustive. Ton objectif est d'atteindre **95% de complétion** du projet.

---

## 📝 TÂCHES PRIORITAIRES

### PHASE 1 - COMPLÉTION DES FONCTIONNALITÉS EXISTANTES (À FAIRE EN PRIORITÉ)

#### 1. **Settings - Actions fonctionnelles** 🔴 CRITIQUE
**Objectif:** Rendre la page Settings complètement fonctionnelle

**Tâches:**
- [ ] Créer `/src/app/api/users/route.ts` (GET, PATCH pour profil)
- [ ] Créer `/src/app/api/users/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/src/app/api/users/password/route.ts` (POST pour changer mot de passe)
- [ ] Implémenter l'action de modification du profil (nom, email)
- [ ] Implémenter le changement de mot de passe avec validation
- [ ] Ajouter la gestion des préférences de notifications
- [ ] Créer un modal pour la gestion des utilisateurs (ADMIN uniquement)
- [ ] Implémenter CRUD utilisateurs (création, modification, suppression, changement de rôle)
- [ ] Ajouter la validation côté serveur (Zod)
- [ ] Tester toutes les fonctionnalités

**Fichiers à créer/modifier:**
- `/src/app/api/users/route.ts` (nouveau)
- `/src/app/api/users/[id]/route.ts` (nouveau)
- `/src/app/api/users/password/route.ts` (nouveau)
- `/src/lib/actions/users.ts` (nouveau)
- `/src/components/forms/user-form.tsx` (nouveau)
- `/src/app/(dashboard)/settings/page.tsx` (modifier)

#### 2. **API REST pour modules existants** 🔴 CRITIQUE
**Objectif:** Créer les API routes manquantes pour permettre l'accès externe

**Tâches:**
- [ ] Créer `/src/app/api/tasks/route.ts` (GET, POST)
- [ ] Créer `/src/app/api/tasks/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/src/app/api/milestones/route.ts` (GET, POST)
- [ ] Créer `/src/app/api/milestones/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/src/app/api/risks/route.ts` (GET, POST)
- [ ] Créer `/src/app/api/risks/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Créer `/src/app/api/workstreams/route.ts` (GET, POST)
- [ ] Créer `/src/app/api/workstreams/[id]/route.ts` (GET, PATCH, DELETE)
- [ ] Tester tous les endpoints avec curl ou Postman

**Note:** Utiliser le même pattern que `/src/app/api/projects/[id]/route.ts` (avec `await params`)

#### 3. **Workstreams Management** 🟡 IMPORTANT
**Objectif:** Permettre la gestion complète des workstreams

**Tâches:**
- [ ] Créer `/src/components/forms/workstream-form.tsx`
- [ ] Ajouter un modal "Nouveau workstream" dans `/src/app/(dashboard)/projects/[id]/page.tsx`
- [ ] Implémenter les actions d'édition et suppression de workstreams
- [ ] Ajouter la validation des données
- [ ] Tester la création, modification, suppression

**Fichiers à créer/modifier:**
- `/src/components/forms/workstream-form.tsx` (nouveau)
- `/src/app/(dashboard)/projects/[id]/page.tsx` (modifier)

#### 4. **Comments & Attachments UI** 🟡 IMPORTANT
**Objectif:** Ajouter l'interface pour les commentaires et pièces jointes sur les tâches

**Tâches:**
- [ ] Créer `/src/components/task-comments.tsx`
- [ ] Créer `/src/components/task-attachments.tsx`
- [ ] Ajouter les API routes pour comments et attachments
- [ ] Implémenter l'ajout de commentaires
- [ ] Implémenter l'upload de fichiers (utiliser un service comme Uploadthing ou S3)
- [ ] Afficher la liste des commentaires et attachments
- [ ] Ajouter la suppression de commentaires (owner uniquement)
- [ ] Tester toutes les fonctionnalités

**Fichiers à créer:**
- `/src/components/task-comments.tsx`
- `/src/components/task-attachments.tsx`
- `/src/app/api/tasks/[id]/comments/route.ts`
- `/src/app/api/tasks/[id]/attachments/route.ts`
- `/src/lib/actions/comments.ts`
- `/src/lib/actions/attachments.ts`

#### 5. **Confirmations de suppression** 🟡 IMPORTANT
**Objectif:** Ajouter des confirmations avant toute suppression

**Tâches:**
- [ ] Créer un composant `ConfirmDialog` réutilisable
- [ ] Ajouter des confirmations dans tous les modules (Projects, Tasks, Risks, etc.)
- [ ] Afficher le nom de l'élément à supprimer
- [ ] Ajouter un message d'avertissement si suppression en cascade
- [ ] Tester toutes les suppressions

**Fichiers à créer/modifier:**
- `/src/components/ui/confirm-dialog.tsx` (nouveau)
- Modifier tous les fichiers avec des boutons de suppression

---

### PHASE 2 - TESTS EXHAUSTIFS (À FAIRE APRÈS PHASE 1)

#### 1. **Tests Fonctionnels par Module**
**Objectif:** Tester chaque module de manière exhaustive

**Pour chaque module (Dashboard, Projects, Tasks, Roadmap, Risks, Hardware, Legal, Pricing, Rewards, Content, Ops, Settings):**

**Tâches:**
- [ ] Tester la création d'un nouvel élément
- [ ] Tester la modification d'un élément existant
- [ ] Tester la suppression d'un élément
- [ ] Tester les filtres et la recherche
- [ ] Tester le tri des colonnes
- [ ] Tester les validations (champs requis, formats)
- [ ] Tester les messages d'erreur
- [ ] Tester les permissions RBAC (tester avec différents rôles)
- [ ] Vérifier la cohérence des données en base
- [ ] Vérifier les redirections après actions

**Créer un document:** `/TESTS_RESULTS.md` avec les résultats

#### 2. **Tests d'Intégration**
**Objectif:** Tester les interactions entre modules

**Scénarios à tester:**
- [ ] Créer un projet → Créer un workstream → Créer une tâche → Assigner à un utilisateur
- [ ] Créer un jalon → Lier à un projet → Marquer comme terminé
- [ ] Créer un risque → Lier à un projet → Mettre à jour le statut
- [ ] Créer un device hardware → Ajouter à un bundle → Marquer comme PRIMARY
- [ ] Créer un document légal → Changer le statut → Télécharger
- [ ] Créer un plan pricing → Activer/désactiver → Réordonner
- [ ] Créer une règle reward → Activer → Simuler des calculs
- [ ] Scanner du contenu HTML → Extraire → Générer markdown → Sauvegarder
- [ ] Créer un runbook → Activer → Marquer les checklist items

#### 3. **Tests de Performance**
**Objectif:** Vérifier que l'application reste performante

**Tâches:**
- [ ] Créer 50+ projets et vérifier le temps de chargement
- [ ] Créer 200+ tâches et tester les filtres
- [ ] Créer 100+ jalons et tester la timeline
- [ ] Vérifier les requêtes N+1 dans la console
- [ ] Optimiser les requêtes Prisma si nécessaire
- [ ] Ajouter de la pagination si les listes sont trop longues

#### 4. **Tests de Sécurité**
**Objectif:** Vérifier la sécurité de l'application

**Tâches:**
- [ ] Tester l'accès aux pages sans authentification (doit rediriger vers /login)
- [ ] Tester l'accès aux API routes sans authentification (doit retourner 401)
- [ ] Tester les permissions RBAC (un VIEWER ne peut pas créer/modifier/supprimer)
- [ ] Tester l'injection SQL (Prisma protège normalement)
- [ ] Tester l'injection XSS dans les champs texte
- [ ] Vérifier que les mots de passe sont hashés (bcrypt)
- [ ] Vérifier que les secrets ne sont pas exposés

#### 5. **Tests Mobile/Responsive**
**Objectif:** Vérifier l'expérience mobile

**Tâches:**
- [ ] Tester sur mobile (iPhone, Android)
- [ ] Tester sur tablette (iPad)
- [ ] Tester les modals sur mobile
- [ ] Tester les tableaux sur mobile (scroll horizontal)
- [ ] Vérifier que tous les boutons sont cliquables
- [ ] Vérifier que les formulaires sont utilisables

---

### PHASE 3 - AMÉLIORATIONS UX (OPTIONNEL)

#### 1. **Messages de succès/erreur**
- [ ] Ajouter des toasts pour les actions (création, modification, suppression)
- [ ] Utiliser un composant Toast réutilisable
- [ ] Afficher des messages clairs et concis

#### 2. **Loading states**
- [ ] Ajouter des spinners pendant les chargements
- [ ] Ajouter des skeletons pour les listes
- [ ] Désactiver les boutons pendant les requêtes

#### 3. **Animations**
- [ ] Ajouter des transitions sur les modals
- [ ] Ajouter des animations sur les listes (fade in)
- [ ] Ajouter des hover effects sur les cards

---

## 🔍 MÉTHODOLOGIE DE TEST

### Pour chaque fonctionnalité testée:

1. **Préparer l'environnement**
   - Se connecter avec `admin@onyx.com` / `onyx2025`
   - Vérifier que la base de données est en bon état

2. **Tester le Happy Path**
   - Suivre le scénario nominal
   - Vérifier que tout fonctionne comme prévu

3. **Tester les Edge Cases**
   - Champs vides
   - Valeurs invalides
   - Données manquantes
   - Suppressions en cascade

4. **Tester les Erreurs**
   - Vérifier les messages d'erreur
   - Vérifier que l'application ne crash pas
   - Vérifier que les données restent cohérentes

5. **Documenter les Résultats**
   - Noter ce qui fonctionne ✅
   - Noter ce qui ne fonctionne pas ❌
   - Noter les bugs trouvés 🐛
   - Noter les améliorations possibles 💡

---

## 📊 LIVRABLES ATTENDUS

À la fin de ta mission, tu devras fournir:

1. **Code complet et testé**
   - Tous les fichiers créés/modifiés
   - Code propre et commenté
   - Pas d'erreurs de lint

2. **Document de tests** (`TESTS_RESULTS.md`)
   - Liste de tous les tests effectués
   - Résultats (✅ ou ❌)
   - Bugs identifiés
   - Captures d'écran si nécessaire

3. **Liste des bugs** (`BUGS_FOUND.md`)
   - Description du bug
   - Étapes pour reproduire
   - Sévérité (Critique, Majeur, Mineur)
   - Statut (Corrigé, À corriger)

4. **README mis à jour**
   - Ajouter les nouvelles fonctionnalités
   - Mettre à jour les instructions
   - Ajouter les nouveaux scripts si nécessaire

---

## 🚀 COMMANDES UTILES

```bash
# Démarrer l'application
cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"
npm run dev

# Accéder à l'application
open http://localhost:3000

# Générer le client Prisma après modification du schema
npm run db:generate

# Pousser le schema vers la DB
npm run db:push

# Ouvrir Prisma Studio pour voir les données
npm run db:studio

# Créer un utilisateur admin
npm run db:create-admin

# Linter
npm run lint
```

---

## ⚠️ RÈGLES IMPORTANTES

1. **Toujours lire les fichiers avant de les modifier**
2. **Respecter les conventions existantes** (naming, architecture, patterns)
3. **Ne pas casser les fonctionnalités existantes**
4. **Tester après chaque modification**
5. **Utiliser TypeScript correctement** (pas de `any`)
6. **Suivre le design system ONYX** (couleurs, composants)
7. **Gérer les erreurs proprement** (try/catch, messages clairs)
8. **Ajouter des logs utiles** (sans données sensibles)
9. **Demander confirmation avant suppressions destructives**
10. **Mettre à jour le README après chaque ajout**

---

## 💬 COMMUNICATION

- **Être concis et structuré** dans les réponses
- **Donner des chemins de fichiers en backticks**
- **Expliquer ce qui va être changé avant de le faire**
- **Dire clairement quand une tâche est terminée**
- **Demander des clarifications si besoin**

---

## 🎯 OBJECTIF FINAL

À la fin de ta mission, l'application doit être:
- ✅ **Complète** (95%+ de fonctionnalités implémentées)
- ✅ **Testée** (tous les modules testés exhaustivement)
- ✅ **Stable** (pas de bugs critiques)
- ✅ **Documentée** (README à jour, tests documentés)
- ✅ **Prête pour la production** (déployable sur Railway/Vercel)

---

**Bonne chance ! 🚀**

---

## 📎 ANNEXES

### Fichiers de référence à lire en priorité:
- `/AUDIT_COMPLET.md` - Audit complet du projet
- `/README.md` - Documentation principale
- `/prisma/schema.prisma` - Schéma de base de données
- `/src/lib/auth.ts` - Configuration de l'authentification
- `/src/app/api/projects/[id]/route.ts` - Exemple d'API route (pattern à suivre)

### Design System ONYX:
- **Fond:** Noir (#000000)
- **Accent cuivre:** #D48961
- **Brun:** #8D5E4D
- **Crème:** #FFF2EE
- **Style:** Premium, glass effects, gradients luxe

### Rôles RBAC:
- **ADMIN:** Accès complet
- **PM:** Gestion projets, tâches, équipes
- **OPS:** Runbooks, hardware, tâches
- **LEGAL:** Documents légaux
- **SALES:** Pricing, propositions
- **VIEWER:** Lecture seule
