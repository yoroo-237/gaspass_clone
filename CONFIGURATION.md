# � Configuration & Déploiement — GasPass
**Admin Telegram:** @gaspassreal
## 🔐 Variables d'Environnement

### Backend `.env` — Local Development

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gaspass_db
DB_USER=miguel
DB_PASSWORD=Mkomegmbdysdia4

# Server
PORT=5001
NODE_ENV=development
SERVER_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_dev_secret_key_change_me
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_dev_refresh_secret
REFRESH_TOKEN_EXPIRE=7d

# Stripe (TEST)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Telegram
TELEGRAM_BOT_TOKEN=8717133590:AAF34M_3TuBUiP0kjTJ1P3wFtyrrqNj5Vic
TELEGRAM_ADMIN_ID=<obtenir_avec_@userinfobot>
TELEGRAM_ADMIN_GROUP_ID=-1001234567890
TELEGRAM_WEBHOOK_URL=http://localhost:5001/api/telegram/webhook

# Admin
ADMIN_EMAIL=admin@gaspass.local
ADMIN_PASSWORD=SecurePassword123!
```

### Railway Backend — Production

Définir sur le dashboard Railway:

```env
NODE_ENV=production
PORT=5001
SERVER_URL=https://api.gaspass.store
FRONTEND_URL=https://gaspass.store

# Database (Railway PostgreSQL)
# → Railway génère automatiquement DATABASE_URL
# → Parse DATABASE_URL dans config/db.js

# Secrets (générer: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<32_bytes_hex_random>
REFRESH_TOKEN_SECRET=<32_bytes_hex_random>

# Stripe LIVE
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Telegram
TELEGRAM_BOT_TOKEN=8717133590:AAF34M_3TuBUiP0kjTJ1P3wFtyrrqNj5Vic
TELEGRAM_ADMIN_ID=<@gaspassreal_user_id>
TELEGRAM_ADMIN_GROUP_ID=-100<your_group_id>
TELEGRAM_WEBHOOK_URL=https://api.gaspass.store/api/telegram/webhook

# Admin Production
ADMIN_EMAIL=admin@gaspass.store
ADMIN_PASSWORD=<very_strong_password>
```

### Frontend `.env` — Local & Vercel

```env
# .env.local (local development)
VITE_API_URL=http://localhost:5001

# Vercel Environment Variables
VITE_API_URL=https://api.gaspass.store
```

---

## 🚀 Commandes Local Development

```bash
# Backend
cd backend
npm install
node scripts/syncDb.js
npm start

# Frontend (autre terminal)
npm install
npm run dev
# → http://localhost:5173
```

---

## 🚀 Déploiement Railway

### Backend API (Node.js + PostgreSQL)

**Étape 1 — Créer le projet Railway**
1. Aller sur [railway.app](https://railway.app)
2. `New Project` → `Deploy from GitHub`
3. Autoriser GitHub et sélectionner le repo `gaspass-clone`
4. Choisir branche `main`

**Étape 2 — Ajouter PostgreSQL**
1. Dans le dashboard Railway, cliquer `+ New Service`
2. Choisir `PostgreSQL`
3. Railway crée la base automatiquement + fournit `DATABASE_URL`

**Étape 3 — Configurer les variables d'environnement**
1. Dans le service Node.js, aller à `Variables`
2. Ajouter toutes les variables (voir section "Railway Backend — Production" ci-dessus)
3. ⚠️ NE PAS mettre `.env` en repo — utiliser Railway dashboard uniquement

**Étape 4 — Configurer le démarrage**
1. Railway détecte automatiquement Node.js
2. Configure `PORT=5001` si nécessaire dans Variables
3. Crée la commande: `npm install && npm start`

**Étape 5 — Domain personnalisé**
1. Dans Railway, aller à `Settings` → `Domain`
2. Ajouter domaine: `api.gaspass.store`
3. Pointer les DNS du domaine vers Railway

**Étape 6 — Déploiement auto**
```bash
git push origin main
# Railway détecte le push et déploie automatiquement
```

✅ Backend prêt à `https://api.gaspass.store`

---

### Frontend (Vite + React sur Vercel)

**Étape 1 — Déployer sur Vercel**
1. Aller sur [vercel.com](https://vercel.com)
2. `Import Project` → sélectionner repo GitHub `gaspass-clone`
3. Choisir branche `main`

**Étape 2 — Configurer le build**
1. Framework: `Vite`
2. Root directory: `.` (racine du projet)
3. Build command: `npm run build`
4. Output directory: `dist`

**Étape 3 — Variables d'environnement Vercel**
1. Aller à `Settings` → `Environment Variables`
2. Ajouter:
```
VITE_API_URL=https://api.gaspass.store
```

**Étape 4 — Domain personnalisé**
1. Dans Vercel, aller à `Settings` → `Domains`
2. Ajouter: `gaspass.store`
3. Pointer les DNS du domaine vers Vercel

**Étape 5 — Déploiement auto**
```bash
git push origin main
# Vercel détecte et déploie automatiquement
```

✅ Frontend prêt à `https://gaspass.store`

---

### DNS Configuration

Sur votre registrar (Namecheap, GoDaddy, etc.):

```
Domain: gaspass.store

A Records:
┌─ api.gaspass.store  → Railway IP (fourni par Railway)
└─ gaspass.store      → Vercel IP (fourni par Vercel)

ou CNAME (recommandé):
┌─ api.gaspass.store  → CNAME railway.app
└─ gaspass.store      → CNAME cname.vercel-dns.com
```

---

## ✅ Checklist Production

- [ ] Variables d'env Railway configurées
- [ ] PostgreSQL Railway créée
- [ ] Node.js API en HTTPS sur `api.gaspass.store`
- [ ] Frontend Vercel en HTTPS sur `gaspass.store`
- [ ] DNS pointant vers Railway (API) et Vercel (Frontend)
- [ ] JWT_SECRET généré aléatoirement (pas de hardcoding)
- [ ] Stripe clés LIVE configurées
- [ ] Telegram bot token configuré (8717133590:AAF34M_3TuBUiP0kjTJ1P3wFtyrrqNj5Vic)
- [ ] CORS config: `FRONTEND_URL=https://gaspass.store`
- [ ] `.env` jamais commité (dans `.gitignore`)
- [ ] `.env.example` en template (commité)

---

**Version:** 2.0  
**Date:** 19 avril 2026  
**Statut:** ✅ Production-Ready
