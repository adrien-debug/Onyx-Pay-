# 🤝 Guide de Contribution - ONYX Launch & Ops

Merci de contribuer à ONYX Launch & Ops ! Ce guide vous aidera à démarrer.

---

## 📋 Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment contribuer](#comment-contribuer)
3. [Standards de code](#standards-de-code)
4. [Workflow Git](#workflow-git)
5. [Tests](#tests)
6. [Documentation](#documentation)

---

## 🤝 Code de conduite

- Soyez respectueux et professionnel
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour le projet
- Aidez les nouveaux contributeurs

---

## 💻 Comment contribuer

### 1. Fork et Clone

```bash
# Fork le repo sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/Onyx-Pay-.git
cd Onyx-Pay-

# Ajoutez le repo original comme remote
git remote add upstream https://github.com/adrien-debug/Onyx-Pay-.git
```

### 2. Créez une branche

```bash
# Créez une branche pour votre feature/fix
git checkout -b feature/ma-nouvelle-feature
# ou
git checkout -b fix/correction-bug
```

### 3. Développez

```bash
# Installez les dépendances
npm install

# Lancez l'app en dev
npm run dev

# Faites vos modifications
# Testez vos changements
```

### 4. Committez

```bash
# Ajoutez vos fichiers
git add .

# Committez avec un message descriptif
git commit -m "feat: ajoute la fonctionnalité X"
```

### 5. Poussez et créez une PR

```bash
# Poussez vers votre fork
git push origin feature/ma-nouvelle-feature

# Créez une Pull Request sur GitHub
```

---

## 📏 Standards de code

### Conventions de nommage

- **Fichiers:** kebab-case (`user-form.tsx`, `api-client.ts`)
- **Composants:** PascalCase (`UserForm`, `ApiClient`)
- **Fonctions:** camelCase (`getUserData`, `handleSubmit`)
- **Constantes:** UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)

### TypeScript

- ✅ Toujours typer les props et retours de fonction
- ✅ Utiliser des interfaces pour les objets complexes
- ✅ Éviter `any` (utiliser `unknown` si nécessaire)
- ✅ Utiliser les types Prisma générés

```typescript
// ✅ Bon
interface UserFormProps {
  user?: User;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  // ...
}

// ❌ Mauvais
export function UserForm({ user, onSuccess }: any) {
  // ...
}
```

### React

- ✅ Utiliser les Server Components par défaut
- ✅ Ajouter `"use client"` seulement si nécessaire
- ✅ Extraire la logique complexe dans des hooks
- ✅ Utiliser les composants UI existants

```typescript
// ✅ Server Component (par défaut)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Component (si interactivité)
"use client";
export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState(...)}>Click</button>;
}
```

### Styling

- ✅ Utiliser TailwindCSS
- ✅ Suivre le design system ONYX (couleurs cuivre, noir, crème)
- ✅ Responsive mobile-first
- ✅ Utiliser les composants UI existants

```typescript
// ✅ Bon
<Button className="bg-copper-500 hover:bg-copper-600">
  Sauvegarder
</Button>

// ❌ Éviter les styles inline
<button style={{ backgroundColor: '#D48961' }}>
  Sauvegarder
</button>
```

---

## 🔄 Workflow Git

### Messages de commit

Suivre la convention [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, style (pas de changement de code)
- `refactor`: Refactoring (pas de changement fonctionnel)
- `perf`: Amélioration de performance
- `test`: Ajout/modification de tests
- `chore`: Tâches de maintenance

**Exemples:**

```bash
feat(tasks): add filter by assignee
fix(dashboard): correct KPI calculation
docs(readme): update installation instructions
style(ui): improve button spacing
refactor(api): simplify error handling
```

### Branches

- `main` - Production (protégée)
- `develop` - Développement (si utilisée)
- `feature/*` - Nouvelles fonctionnalités
- `fix/*` - Corrections de bugs
- `hotfix/*` - Corrections urgentes en prod

---

## ✅ Tests

### Avant de soumettre une PR

```bash
# Linter
npm run lint

# Build
npm run build

# Tests manuels
npm run dev
# Testez toutes les fonctionnalités modifiées
```

### Checklist de test

- [ ] Testé sur Chrome
- [ ] Testé sur Firefox
- [ ] Testé sur Safari (si macOS)
- [ ] Testé sur mobile (responsive)
- [ ] Pas d'erreurs dans la console
- [ ] Pas d'erreurs de lint
- [ ] Build réussit
- [ ] Toutes les fonctionnalités existantes fonctionnent

---

## 📝 Documentation

### Code

```typescript
// ✅ Documenter les fonctions complexes
/**
 * Calculate risk score based on probability and impact
 * @param probability - Risk probability (1-5)
 * @param impact - Risk impact (1-5)
 * @returns Risk score (1-25)
 */
export function calculateRiskScore(probability: number, impact: number): number {
  return probability * impact;
}
```

### README

- Mettre à jour le README si vous ajoutez une fonctionnalité
- Ajouter des exemples d'utilisation
- Documenter les nouvelles variables d'environnement

### Changements breaking

Si votre PR introduit un breaking change:
1. Documentez-le clairement dans la PR
2. Mettez à jour le README
3. Ajoutez un guide de migration si nécessaire

---

## 🐛 Rapporter un bug

1. Vérifiez que le bug n'est pas déjà signalé
2. Créez une issue avec le template "Bug Report"
3. Incluez les étapes pour reproduire
4. Ajoutez des screenshots si applicable
5. Mentionnez votre environnement (OS, navigateur, etc.)

---

## 💡 Proposer une fonctionnalité

1. Créez une issue avec le template "Feature Request"
2. Décrivez clairement la fonctionnalité
3. Expliquez pourquoi elle est nécessaire
4. Ajoutez des mockups si possible
5. Attendez la validation avant de développer

---

## 🚀 Déploiement

Le déploiement est automatique sur Railway:
- Push sur `main` → Déploiement en production
- Les migrations Prisma s'exécutent automatiquement

---

## 📞 Besoin d'aide ?

- Consultez la [documentation](./README.md)
- Lisez l'[audit complet](./AUDIT_COMPLET.md)
- Créez une issue avec vos questions

---

**Merci de contribuer à ONYX Launch & Ops ! 🚀**
