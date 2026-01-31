#!/bin/bash
set -e

echo "🚀 Déploiement ONYX sur Railway - Configuration automatique"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cd "/Users/adrienbeyondcrypto/Desktop/Onyx Pay/onyx-launch-ops"

echo -e "${YELLOW}Étape 1: Vérification Railway CLI${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI non installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Railway CLI installé${NC}"

echo ""
echo -e "${YELLOW}Étape 2: Ajout de PostgreSQL dans Railway${NC}"
echo "⚠️  Ceci nécessite une interaction manuelle"
echo ""
echo "Ouvrez votre navigateur sur:"
echo "https://railway.app/project/36240464-06f3-43dc-899c-99f113d9c4cd"
echo ""
echo "Puis:"
echo "1. Cliquer sur '+ New'"
echo "2. Sélectionner 'Database'"
echo "3. Choisir 'Add PostgreSQL'"
echo ""
read -p "Appuyez sur ENTER une fois PostgreSQL ajouté..."

echo ""
echo -e "${YELLOW}Étape 3: Récupération de DATABASE_URL${NC}"
echo "Railway a automatiquement créé la variable DATABASE_URL"
echo "Vérification..."

railway variables | grep DATABASE_URL || echo -e "${RED}❌ DATABASE_URL non trouvée${NC}"

echo ""
echo -e "${YELLOW}Étape 4: Redéploiement${NC}"
echo "Railway va automatiquement redéployer avec la nouvelle base"
echo "Attente du déploiement..."

sleep 5
railway logs --deployment --lines 20

echo ""
echo -e "${YELLOW}Étape 5: Création de l'utilisateur admin${NC}"
echo "Attente que les tables soient créées..."
sleep 10

railway run npm run db:create-admin

echo ""
echo -e "${GREEN}✅ Déploiement terminé!${NC}"
echo ""
echo "🎉 Application accessible sur:"
echo "https://onyx-pay-production.up.railway.app"
echo ""
echo "Credentials:"
echo "  Email: admin@onyx.com"
echo "  Password: onyx2025"
