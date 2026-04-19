# 📋 Configuration Complète — GasPass Project

## ✅ Statut: Groupe 1, 2, 3 appliqués

---

## 📦 Dépendances Installées

### Installation effectuée:
```bash
npm install helmet winston multer
npm uninstall express-fileupload
```

### Versions attendues:
- **helmet** ^7.0.0 — Headers de sécurité
- **winston** ^3.11.0 — Logging structuré
- **multer** ^1.4.5 — Upload fichiers

---

## 🗂️ Fichiers Créés

### Nouveaux fichiers backend:

```
backend/
├── utils/
│   └── tokenBlacklist.js          ✅ Blacklist tokens (révocation)
│   └── logger.js                  ✅ Logger Winston structuré
│
├── models/
│   └── TelegramLinkCode.js        ✅ Table DB pour codes Telegram
│
├── logs/                          ✅ Dossier (créé automatiquement)
│   ├── error.log
│   ├── combined.log
│   └── .gitkeep
```

---

## 🔐 Variables d'Environnement (.env)

### Configuration de développement (LOCAL):

```env
# ======================================
# CONFIGURATION LOCALE (DÉVELOPPEMENT)
# NE PAS COMMITER - Ignorer par .gitignore
# ======================================

# Database (LOCAL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaspass_db
DB_USER=miguel
DB_PASSWORD=Mkomegmbdysdia4

# Server (LOCAL DEVELOPMENT)
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# JWT (Générer: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=7d

# Stripe (TEST KEYS)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_ADMIN_GROUP_ID=-1001234567890
TELEGRAM_WEBHOOK_URL=http://localhost:5000/api/telegram/webhook

# Admin Credentials (LOCAL)
ADMIN_EMAIL=ton_email@domain.com
ADMIN_PASSWORD=MotDePasseTresSecurise123!
SEED_ADMIN_EMAIL=superadmin@domain.com
SEED_ADMIN_PASSWORD=AutreMotDePasse456!

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Configuration de production (RAILWAY/VERCEL):

**À configurer directement dans les dashboards (PAS de fichier .env):**

```env
# Database (Railway fournit)
DB_HOST=<railway-host>
DB_PORT=5432
DB_NAME=gaspass_db
DB_USER=<railway-user>
DB_PASSWORD=<railway-password>

# Server (PRODUCTION)
PORT=5000
NODE_ENV=production
SERVER_URL=https://api.gaspass.store
FRONTEND_URL=https://gaspass.store,https://www.gaspass.store

# JWT (Générer une clé sécurisée)
JWT_SECRET=<crypto.randomBytes(32).toString('hex')>
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=<crypto.randomBytes(32).toString('hex')>
REFRESH_TOKEN_EXPIRE=7d

# Stripe (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_your_live_secret
STRIPE_PUBLIC_KEY=pk_live_your_live_public
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret

# Telegram
TELEGRAM_BOT_TOKEN=<from-botfather>
TELEGRAM_ADMIN_GROUP_ID=-1001234567890
TELEGRAM_WEBHOOK_URL=https://api.gaspass.store/api/telegram/webhook

# Admin Credentials (PRODUCTION)
ADMIN_EMAIL=admin@gaspass.store
ADMIN_PASSWORD=<very-strong-password>
SEED_ADMIN_EMAIL=superadmin@gaspass.store
SEED_ADMIN_PASSWORD=<very-strong-password>
```

---

## 🚀 Commandes à Exécuter

### 1️⃣ Setup Initial (DEV)

```bash
# Naviguer au backend
cd backend

# Installer les dépendances
npm install

# Synchroniser les tables de base de données
node scripts/syncDb.js

# Créer l'utilisateur admin
node scripts/createAdmin.js
```

### 2️⃣ Démarrer le serveur (DEV)

```bash
# Mode développement (logs colorés)
npm start

# Alternative: avec nodemon (auto-reload)
npm run dev
```

### 3️⃣ Synchroniser la nouvelle table TelegramLinkCode

```bash
# Une seule fois après les patchs
node scripts/syncDb.js
```

### 4️⃣ Tester les webhooks Stripe (Optionnel)

```bash
# Terminal séparé: écouter les webhooks Stripe
stripe listen --forward-to localhost:5000/api/payment/webhook

# Vous obtiendrez une clé webhook à ajouter dans .env:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ✅ Tests & Vérifications

### 1. Vérifier les headers de sécurité

```bash
curl -I http://localhost:5000/

# Doit retourner (au minimum):
# X-Frame-Options: DENY
# Strict-Transport-Security: max-age=31536000
# Content-Security-Policy: default-src 'self'
```

### 2. Tester le logout (révocation token)

```bash
# 1. Obtenir un token (login)
RESULT=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')
TOKEN=$(echo $RESULT | jq -r '.token')

# 2. Logout (revoque le token)
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# 3. Réutiliser le token → doit retourner 401
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
# ❌ Erreur attendue: "Token révoqué"
```

### 3. Tester l'upload multer

```bash
# Créer une image test
echo "fake image data" > test.jpg

# Upload (admin seulement)
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "image=@./test.jpg"

# Réponse attendue:
# {
#   "success": true,
#   "filename": "1713607200000-abc12345.jpg",
#   "url": "/uploads/1713607200000-abc12345.jpg",
#   "size": 15,
#   "mimetype": "image/jpeg"
# }
```

### 4. Tester les logs (Production mode)

```bash
# Démarrer en mode production
NODE_ENV=production npm start

# Les logs JSON doivent être écrits dans:
tail -f logs/combined.log
tail -f logs/error.log
```

### 5. Tester CORS multi-domaine

```bash
# Dev (sans origin = autorisé)
curl -X GET http://localhost:5000/ 

# Production (avec origin validée)
curl -X GET http://localhost:5000/ \
  -H "Origin: https://gaspass.store"

# Origine non autorisée
curl -X GET http://localhost:5000/ \
  -H "Origin: https://unauthorized.com"
# ❌ Erreur attendue: "CORS: origine non autorisée"
```

### 6. Tester la restriction du profil public

```bash
# GET /api/users/:id (public)
curl -X GET http://localhost:5000/api/users/1

# Réponse attendue (minimaliste):
# {
#   "id": 1,
#   "firstName": "John",
#   "lastName": "Doe",
#   "createdAt": "2026-04-19T10:00:00.000Z"
# }
# ❌ email, phone, role, address NON retournés
```

### 7. Tester l'annulation de commande (restriction utilisateur)

```bash
# Créer une commande pending
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...order data...}'
# → Récupérer ORDER_ID

# Essayer status "processing" (doit échouer)
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
# ❌ Erreur 403: "Vous ne pouvez qu'annuler votre commande"

# Essayer status "cancelled" sur pending (doit marcher)
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"cancelled"}'
# ✅ Success
```

### 8. Tester la recherche admin orders (JSONB)

```bash
# Chercher par adresse (JSONB casting)
curl -X GET "http://localhost:5000/api/admin/orders?search=Paris" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# ✅ Ne doit plus planter, retourne les commandes avec "Paris" en shipping_address
```

---

## 📊 Résumé des Patchs Appliqués

### 🔴 GROUPE 1 — Sécurité Critique (5 fichiers)

| Patch | Fichier | Changement |
|-------|---------|-----------|
| 1 | `createAdmin.js`, `seedDb.js` | Credentials de `.env` (PAS hardcodés) |
| 2 | `routes/telegram.js` | `/link` protégé + validation code |
| 3 | `routes/orders.js` | GET `/:id` sécurisé (vérify token) |
| 4 | `server.js`, `payment.js` | Stripe webhook `rawBody` → multer |
| 5 | `scripts/seedDb.js` | Blocage `force: true` en production |

### 🟠 GROUPE 2 — Fonctionnalité (5 fichiers)

| Patch | Fichier | Changement |
|-------|---------|-----------|
| 1 | `routes/admin.js` | Superadmin séparé (JWT check) |
| 2 | `auth.js`, `tokenBlacklist.js` | Logout = révocation token |
| 3 | `routes/orders.js` | Retry orderNumber collision |
| 4 | `routes/orders.js` | User ne peut QUE annuler commandes |
| 5 | `routes/admin.js` | Recherche JSONB fixée (PostgreSQL cast) |

### 🟡 GROUPE 3 — Amélioration (6 fichiers)

| Patch | Fichier | Changement |
|-------|---------|-----------|
| 1 | `routes/users.js` | Profil public minimaliste |
| 2 | `server.js` | Helmet + CSP headers |
| 3 | `server.js` | CORS dynamique multi-domaine |
| 4 | `*Controller.js`, `*routes.js` | Logger Winston (remplace console) |
| 5 | `routes/upload.js` | Multer (remplace express-fileupload) |
| 6 | `routes/telegram.js` | Codes Telegram en DB (PAS mémoire) |

---

## 🛡️ Sécurité — Checklist

- ✅ Credentials en `.env` (jamais hardcodés)
- ✅ `.env` dans `.gitignore` (jamais commité)
- ✅ `.env.example` en template (commité)
- ✅ Helmet + CSP headers activés
- ✅ CORS dynamique et validé
- ✅ JWT tokens révocables (logout)
- ✅ Superadmin séparé des admins
- ✅ Profil public minimaliste
- ✅ Upload validé (type + taille)
- ✅ Logs structurés (Winston)
- ✅ Codes Telegram en DB (persistent)
- ✅ OrderNumber avec retry anti-collision
- ✅ User ne peut QUE annuler ses commandes

---

## 📝 Fichiers Git

### À commiter:
```
backend/.env.example
backend/utils/logger.js
backend/models/TelegramLinkCode.js
backend/routes/upload.js (modifié)
backend/server.js (modifié)
backend/middleware/auth.js (modifié)
backend/routes/orders.js (modifié)
backend/routes/admin.js (modifié)
backend/routes/telegram.js (modifié)
backend/routes/users.js (modifié)
backend/routes/products.js (modifié)
backend/controllers/authController.js (modifié)
backend/services/telegramService.js (modifié)
backend/utils/tokenBlacklist.js (modifié)
```

### À JAMAIS commiter:
```
backend/.env (PAS SECRET EN GIT!)
backend/logs/ (au moins .gitkeep)
backend/uploads/ (fichiers utilisateurs)
node_modules/
```

---

## 🌍 Déploiement Production

### Railway (Backend API)

1. **Créer un projet Railway**
   - Connecter repo GitHub
   - Ajouter PostgreSQL
   - Configurer variables d'env (voir section "Configuration de production")

2. **Variables d'env Railway**
   - `NODE_ENV=production`
   - `SERVER_URL=https://api.gaspass.store`
   - `FRONTEND_URL=https://gaspass.store,https://www.gaspass.store`
   - Tous les secrets (JWT, Stripe, Telegram, etc.)

3. **Deploy**
   ```bash
   git push origin main
   # Railway détecte Node.js et lance automatiquement
   # npm install && npm start
   ```

### Vercel (Frontend React)

1. **Créer projet Vercel**
   - Importer repo
   - Framework: Vite/React

2. **Variables d'env Vercel**
   - `VITE_API_URL=https://api.gaspass.store`

3. **Deploy**
   ```bash
   git push origin main
   # Auto-build et deploy
   ```

### DNS Pointing

```
gaspass.store          → Vercel IP (Frontend)
api.gaspass.store      → Railway IP (Backend API)
```

Utilisez votre registrar (Namecheap, GoDaddy, etc.)

---

## 🔧 Troubleshooting

### "Port 5000 already in use"
```bash
# Trouver le PID
lsof -i :5000
# Tuer le process
kill -9 <PID>
```

### "CORS: origine non autorisée"
```bash
# Vérifier .env
echo $FRONTEND_URL
# Doit contenir votre domaine séparé par virgule
```

### "Token révoqué" après logout
✅ Comportement normal! Le token est blacklisté.

### Logs ne s'affichent pas
```bash
# Vérifier NODE_ENV
echo $NODE_ENV
# En production: check logs/combined.log
tail -f backend/logs/combined.log
```

### Telegram codes ne se créent pas
```bash
# Vérifier la migration
node backend/scripts/syncDb.js
# Check DB: SELECT * FROM "TelegramLinkCodes";
```

---

## 📞 Support & Questions

Pour chaque groupe de patchs, consultez le ticket GitHub correspondant:
- **GROUPE 1** (Sécurité critique) — #001
- **GROUPE 2** (Fonctionnalité) — #002
- **GROUPE 3** (Amélioration) — #003

---

**Version:** 1.0  
**Date:** 19 avril 2026  
**Statut:** ✅ Complet & Testé
