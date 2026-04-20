# 🎯 PLAN D'IMPLÉMENTATION FRONTEND — API Centralisée

**Objectif:** Remplacer TOUTES les données mockées par des appels API centralisés  
**Status:** ✅ PHASE 1 & 2 & 3 COMPLÉTÉES | ✅ ADMIN PANEL COMPLÉTÉ | ✅ CONTENT (100% API-DRIVEN)  
**Date:** 20 avril 2026

**✅ PHASES 1, 2 & 3 + ADMIN COMPLÉTÉES — 20 AVRIL 2026:**
- ✅ `src/api/client.js`: Étendu avec 25+ endpoints
- ✅ `src/pages/ShopCategoryPage.jsx`: 19 produits mockés → API
- ✅ `src/pages/ProductDetailPage.jsx`: Lookup + related → API
- ✅ `src/components/ShopSection.jsx`: 6 produits → API
- ✅ `src/components/Navbar.jsx`: 3 produits populaires → API
- ✅ `src/components/AboutSection.jsx`: 4 catégories → API
- ✅ `src/components/OctaneSection.jsx`: 4 tiers → API (getCategories)
- ✅ `src/pages/admin/AdminDashboard.jsx`: Stats → getAdminDashboard()
- ✅ `src/pages/admin/AdminOrders.jsx`: Commandes → getAdminOrders()
- ✅ `src/pages/admin/AdminProducts.jsx`: CRUD → getAdminProducts/createProduct/updateProduct/deleteProduct
- ✅ `src/pages/admin/AdminUsers.jsx`: Users → getAdminUsers()
- ✅ `src/components/SpecsSection.jsx`: 6 specs → getSpecs()
- ✅ `src/components/OrderSection.jsx`: 3 FAQs → getFaqs()
- ✅ `src/components/MarqueeTicker.jsx`: 6 items → getTickerItems()
- **Total mockées supprimées:** 80+ entrées | **API centralisée: 100%**

---

## 📊 INVENTAIRE DES DONNÉES MOCKÉES

### 🔴 ZONES PUBLIQUES (7 composants)

| Composant | Données Mockées | Fichier | Ligne | Impact | Priorité |
|-----------|-----------------|---------|-------|--------|----------|
| **ShopCategoryPage** | 19 produits hardcodés | `src/pages/ShopCategoryPage.jsx` | L3-20 | ⚠️ CRITIQUE | 🔴 P1 |
| **ProductDetailPage** | 19 produits (copie) | `src/pages/ProductDetailPage.jsx` | L5-100 | ⚠️ CRITIQUE | 🔴 P1 |
| **ShopSection** | 6 produits showcase | `src/components/ShopSection.jsx` | L5-40 | Moyenne | 🟡 P2 |
| **OctaneSection** | 4 tiers/grades | `src/components/OctaneSection.jsx` | L5-15 | Basse | 🟢 P3 |
| **SpecsSection** | 6 specs (images) | `src/components/SpecsSection.jsx` | - | Basse | 🟢 P3 |
| **AboutSection** | 4 catégories | `src/components/AboutSection.jsx` | L8-14 | Moyenne | 🟡 P2 |
| **OrderSection** | 3 FAQs | `src/components/OrderSection.jsx` | L30-33 | Basse | 🟢 P3 |
| **Navbar** | 3 produits populaires | `src/components/Navbar.jsx` | L46-58 | Basse | 🟢 P3 |
| **MarqueeTicker** | 6 items répétés | `src/components/MarqueeTicker.jsx` | - | Basse | 🟢 P3 |

**Total données mockées:** ~60-70 entrées  
**Dépendances non-mockées:** CartContext, localStorage (OK)

---

## 🛠️ API MANQUANTES À AJOUTER

### Backend ✅ (Déjà disponibles):
```
✅ GET  /products              → Tous les produits
✅ GET  /products/:id          → Produit détail
✅ GET  /categories            → Catégories/tiers
✅ GET  /categories/:slug      → Catégorie détail
✅ GET  /tags                  → Tags produits
✅ GET  /admin/dashboard       → Stats admin
✅ GET  /admin/orders          → Commandes liste
✅ GET  /admin/products        → Produits admin
✅ GET  /admin/users           → Utilisateurs
✅ GET  /admin/logs            → Audit logs
```

### Frontend 🟡 (À AJOUTER dans client.js):
```
❌ getCategories()              → GET /categories
❌ getCategory(slug)            → GET /categories/{slug}
❌ getAllTags()                 → GET /tags
❌ getAdminDashboard()          → GET /admin/dashboard
❌ getAdminOrders()             → GET /admin/orders
❌ getAdminProducts()           → GET /admin/products
❌ getAdminUsers()              → GET /admin/users
❌ createProduct(data)          → POST /admin/products
❌ updateProduct(id, data)      → PUT /admin/products/:id
❌ deleteProduct(id)            → DELETE /admin/products/:id
❌ createCategory(data)         → POST /admin/categories
❌ updateCategory(id, data)     → PUT /admin/categories/:id
❌ deleteCategory(id)           → DELETE /admin/categories/:id
❌ getReviews(productId)        → GET /reviews/product/:id
❌ createReview(data)           → POST /reviews
❌ getAddresses()               → GET /users/me/addresses
❌ createAddress(data)          → POST /users/me/addresses
❌ updateAddress(id, data)      → PUT /users/me/addresses/:id
❌ deleteAddress(id)            → DELETE /users/me/addresses/:id
❌ getCart()                    → GET /cart
❌ addToCart(item)              → POST /cart/items
❌ updateCartItem(item)         → PUT /cart/items
❌ removeFromCart(productId)    → DELETE /cart/items
❌ clearCart()                  → DELETE /cart
```

---

## 📋 PLAN D'ACTION PAR PRIORITÉ

### ✅ 🔴 PHASE 1 — CRITIQUE (P1) — TERMINÉE ✅

#### **1.1 — ✅ Étendre `src/api/client.js`**

**Status:** ✅ COMPLÉTÉ — 25+ endpoints ajoutés

**Implémenté:**
```javascript
// Categories (2)
✅ getCategories(filters)
✅ getCategory(slug)

// Products (6)
✅ getProducts(filters) → Now supports {grade} param
✅ getProduct(slug)
✅ createProduct(data)
✅ updateProduct(id, data)
✅ deleteProduct(id)
✅ getAllTags()

// Admin (8+)
✅ getAdminDashboard(period)
✅ getAdminOrders(page, limit)
✅ getAdminProducts(page, limit)
✅ getAdminUsers(page, limit)
✅ getAdminLogs(page, limit)
✅ manageProductTags(productId, action, tags)
✅ createCategory/updateCategory/deleteCategory

// Reviews, Addresses, Cart (15+)
✅ getReviews(productId)
✅ createReview(data)
✅ updateReview(id, data)
✅ deleteReview(id)
✅ getAddresses()
✅ createAddress/updateAddress/deleteAddress
✅ getCart()
✅ addToCart/updateCartItem/removeFromCart/clearCart
```

**Localisation:** [src/api/client.js](src/api/client.js) (lignes 30-170)

---

#### **1.2 — ✅ ShopCategoryPage.jsx — Remplacer produits mockés**

**Status:** ✅ COMPLÉTÉ

**Avant:** 19 produits hardcodés dans `ALL_PRODUCTS` array (L3-20)  
**Après:** API-driven avec `getProducts(grade)` 

**Changements:**
- ✅ Supprimé 19 entrées mockées
- ✅ Ajouté state: `products`, `loading`, `error`
- ✅ useEffect: Fetch `getProducts({grade})` au changement de filtre
- ✅ Gestion d'erreur + loading state
- ✅ Filtrage par grade via API

**Localisation:** [src/pages/ShopCategoryPage.jsx](src/pages/ShopCategoryPage.jsx)

---

#### **1.3 — ✅ ProductDetailPage.jsx — Remplacer lookup produit**

**Status:** ✅ COMPLÉTÉ

**Avant:** Lookup dans `PRODUCTS` array hardcodé (19 entrées) à la ligne `PRODUCTS.find(p => p.slug === id)`  
**Après:** API-driven avec `getProduct(slug)` + related dynamiques

**Changements:**
- ✅ Supprimé 19 entrées mockées
- ✅ Ajouté state: `product`, `related`, `loading`, `error`
- ✅ useEffect: Fetch product + related products via API
- ✅ Gestion d'erreur + loading state
- ✅ Related products dynamiques via `getProducts()` + filter
- ✅ Prix/images récupérés depuis API

**Localisation:** [src/pages/ProductDetailPage.jsx](src/pages/ProductDetailPage.jsx)

---

### ✅ 🟡 PHASE 2 — MOYENNE (P2) — TERMINÉE ✅

#### **2.1 — ✅ ShopSection.jsx — Produits showcase**

**Status:** ✅ COMPLÉTÉ

**Avant:** 6 produits hardcodés dans `PRODUCTS` array  
**Après:** API-driven avec `getProducts({limit: 6})`

**Changements:**
- ✅ Supprimé 6 entrées mockées
- ✅ Ajouté state: `products`, `loading`
- ✅ useEffect: Fetch `getProducts({limit: 6})`
- ✅ Gestion loading state

**Localisation:** [src/components/ShopSection.jsx](src/components/ShopSection.jsx)

---

#### **2.2 — ✅ Navbar.jsx — Produits populaires**

**Status:** ✅ COMPLÉTÉ

**Avant:** 3 produits hardcodés dans `POPULAR_ITEMS`  
**Après:** API-driven avec `getProducts({limit: 3})`

**Changements:**
- ✅ Supprimé 3 entrées mockées + POPULAR_ITEMS const
- ✅ Ajouté state: `popularItems`
- ✅ useEffect: Fetch `getProducts({limit: 3})`
- ✅ Adapté accès images: `item.images[0]` (format API)

**Localisation:** [src/components/Navbar.jsx](src/components/Navbar.jsx)

---

#### **2.3 — ✅ AboutSection.jsx — Catégories dynamiques**

**Status:** ✅ COMPLÉTÉ

**Avant:** 4 catégories hardcodées + imports images  
**Après:** API-driven avec `getCategories()`

**Changements:**
- ✅ Supprimé 4 entrées mockées + imports images
- ✅ Ajouté state: `categories`, `loading`
- ✅ useEffect: Fetch `getCategories()`
- ✅ Formaté données: Convert API response pour match UI
- ✅ Gestion loading state

**Localisation:** [src/components/AboutSection.jsx](src/components/AboutSection.jsx)

---

### 🟢 PHASE 3 — BASSE (P3)

#### **3.1 — OctaneSection.jsx — Tiers/Grades dynamiques**

**Avant:**
```javascript
const TIERS = [
  { grade: '87', label: 'Regular', description: '...' },
  // 3 autres
];
```

**Après:**
```javascript
// Créer un hook pour récupérer les catégories
useEffect(() => {
  const fetch = async () => {
    const data = await getCategories();
    setTiers(data);
  };
  fetch();
}, []);
```

**Fichier:** `src/components/OctaneSection.jsx`

---

#### **3.2 — OrderSection.jsx — FAQs (À décider si API ou statique)**

**Option A - Statique (recommandé):**
```javascript
const FAQS = [
  { q: 'How fast is Shipping?', a: 'We ship within 24–48 hours...' },
  // 2 autres
];
// Pas de changement
```

**Option B - API (si FAQ en DB):**
```javascript
const [faqs, setFaqs] = useState([]);
useEffect(() => {
  const fetch = async () => {
    const data = await api.get('/faqs');
    setFaqs(data);
  };
  fetch();
}, []);
```

**Recommandation:** Garder statique (FAQs ne changent pas)  
**Fichier:** `src/components/OrderSection.jsx`

---

## 🎯 ADMIN PANEL — IMPLÉMENTATIONS MANQUANTES

### AdminDashboard.jsx
**À implémenter:**
```javascript
✅ Récupérer stats: GET /admin/dashboard?period=30d
✅ Afficher graphiques revenus
✅ Afficher commandes récentes
✅ Sélecteur période (7d, 30d, 90d, 1y)
```

**Fichier:** `src/pages/admin/AdminDashboard.jsx`

---

### AdminOrders.jsx
**À implémenter:**
```javascript
✅ Lister commandes: GET /admin/orders
✅ Filtrer par statut/paiement
✅ Modifier statut: PUT /admin/orders/:id
✅ Afficher détails commande
✅ Pagination
```

**Fichier:** `src/pages/admin/AdminOrders.jsx`

---

### AdminProducts.jsx
**À implémenter:**
```javascript
✅ Lister produits: GET /admin/products
✅ Créer produit: POST /admin/products
✅ Modifier produit: PUT /admin/products/:id
✅ Supprimer produit: DELETE /admin/products/:id
✅ Uploader images: POST /upload
✅ Gérer tags: POST/DELETE /admin/products/:id/tags
✅ Pagination + filtrage
```

**Fichier:** `src/pages/admin/AdminProducts.jsx`

---

### AdminUsers.jsx
**À implémenter:**
```javascript
✅ Lister utilisateurs: GET /admin/users
✅ Modifier user: PUT /admin/users/:id
✅ Filtrer par rôle/vérification
✅ Promouvoir en admin
✅ Pagination
```

**Fichier:** `src/pages/admin/AdminUsers.jsx`

---

## 📦 HOOK À CRÉER

### `useApi.js` — Hook réutilisable
```javascript
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoint, options);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetch();
  }, [endpoint]);
  
  return { data, loading, error };
};
```

**Usage:**
```javascript
const { data: products, loading, error } = useApi('/products?limit=6');
```

---

## 🔄 CART — À MIGRER (SI APPLICABLE)

**Actuellement:** localStorage uniquement  
**À considérer:**

```javascript
// Option 1 — Garder localStorage (OK pour MVP)
// Avantage: Pas d'appel API, persistance locale
// Inconvénient: Pas de sync multi-device

// Option 2 — Ajouter API (Pour production)
✅ GET  /api/cart              → Récupérer panier
✅ POST /api/cart/items        → Ajouter article
✅ PUT  /api/cart/items        → Modifier quantité
✅ DELETE /api/cart/items      → Supprimer article
✅ DELETE /api/cart            → Vider panier

// Hybride (Recommandé):
- Garder localStorage pour vitesse
- Sync vers API en fond lors du checkout
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

### ✅ Phase 1 (P1) - COMPLÉTÉE ✅
- [x] Étendre `src/api/client.js` avec 25+ endpoints
- [x] Remplacer ShopCategoryPage (19 produits)
- [x] Remplacer ProductDetailPage (lookup dynamique)
- [x] Tests: Filtrage produits, détail produit

### ✅ Phase 2 (P2) - COMPLÉTÉE ✅
- [x] ShopSection.jsx — Showcase dynamique (6 produits)
- [x] Navbar.jsx — Produits populaires (3 items)
- [x] AboutSection.jsx — Catégories dynamiques (4 catégories)
- [x] Tests: Affichage sections, navigation

### 🟢 Phase 3 (P3) - À COMMENCER 🟢
- [ ] OctaneSection.jsx — Tiers dynamiques (4 grades)
- [ ] SpecsSection.jsx — Specs dynamiques (6 specs) — LOW PRIORITY
- [ ] MarqueeTicker.jsx — Items répétés — LOW PRIORITY
- [ ] Tests: Sections affichées correctement

### Admin Panel - PLANIFIÉE
- [ ] AdminDashboard.jsx — Stats API
- [ ] AdminOrders.jsx — Gestion commandes API
- [ ] AdminProducts.jsx — CRUD API
- [ ] AdminUsers.jsx — Gestion users API
- [ ] Tests E2E admin

---

## 🧪 TESTS À EFFECTUER

```bash
# Avant chaque déploiement:

# Produits
✓ Lister produits → affichage correct
✓ Filtrer par grade → API fonctionne
✓ Détail produit → données dynamiques
✓ Ajouter panier → interaction OK

# Admin
✓ Login admin → token stocké
✓ Dashboard → stats affichées
✓ Créer produit → POST fonctionne
✓ Modifier produit → PUT fonctionne
✓ Supprimer produit → DELETE fonctionne
✓ Gestion users → rôles OK
✓ Commandes → statut modifiable

# Performance
✓ Chargement < 2s pour listing
✓ Images optimisées
✓ Pas de 404 sur assets
```

---

## 📝 NOTES IMPORTANTES

1. **Gestion d'erreur:** Ajouter `<ErrorBoundary>` sur pages critiques
2. **Loading states:** Afficher spinners pendant chargement
3. **Cache:** Envisager React Query pour optimiser requêtes
4. **Auth:** Vérifier token JWT valide avant admin
5. **CORS:** Backend configuré pour `http://localhost:5173`
6. **Rate limiting:** 200 req/15min par user (mindful des appels)

---

**Prêt à commencer? Proposez PHASE 1 et je commence l'implémentation!** 🚀
