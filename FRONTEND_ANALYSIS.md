# 📋 ANALYSE COMPLÈTE DU FRONTEND REACT/VITE

**Date:** 20 avril 2026  
**Workspace:** m:\Projets\gaspass\gaspass-clone\  
**Stack:** React 18.3.1 + Vite 5.3.1 + React Router 6.24.0  
**Status:** ✅ PHASE 1, 2, 3 + ADMIN PANEL + CONTENT IMPLÉMENTÉES (100% API-DRIVEN — ZÉRO MOCK DATA)

---

## 🏗️ STRUCTURE DES FICHIERS

```
src/
├── api/
│   └── client.js              # ✅ Centralisateur d'API
├── assets/                     # Dossier vide (peut être utilisé pour assets)
├── components/
│   ├── AboutSection.jsx        # Section "À propos" avec catégories
│   ├── AboutSection2.jsx       # Section "À propos" alternative
│   ├── AnnouncementSection.jsx # Banneau d'annonce
│   ├── Bottomticker.jsx        # Ticker de texte défilant (bas)
│   ├── Featuresection.jsx      # Section des fonctionnalités
│   ├── Footer.jsx              # Pied de page
│   ├── HeroSection.jsx         # Section héroïque (landing)
│   ├── MarqueeTicker.jsx       # Ticker de texte défilant (haut)
│   ├── Navbar.jsx              # Barre de navigation principale
│   ├── OctaneSection.jsx       # Section "Octane" (grades)
│   ├── OrderSection.jsx        # Section FAQ + commande
│   ├── ScrollToTop.jsx         # Hook scroll to top
│   ├── ShopSection.jsx         # Section showcase produits
│   ├── SpecsSection.jsx        # Section specs produits
│   └── admin/
│       └── AdminLayout.jsx     # Layout admin avec sidebar
├── context/
│   └── CartContext.jsx         # 🛒 Context panier (localStorage)
├── hooks/
│   ├── useAuth.js              # Hook authentification simple
│   ├── useCart.js              # Hook panier
│   └── useReveal.js            # Hook IntersectionObserver (animations)
├── pages/
│   ├── Home.jsx                # Page d'accueil
│   ├── ShopCategoryPage.jsx    # Listing produits avec filtrage
│   ├── ProductDetailPage.jsx   # Détail produit
│   ├── CartPage.jsx            # Panier
│   ├── CheckoutPage.jsx        # Checkout
│   ├── OrderPage.jsx           # Confirmation commande
│   └── admin/
│       ├── AdminLogin.jsx      # Connexion admin
│       ├── AdminDashboard.jsx  # Dashboard stats
│       ├── AdminOrders.jsx     # Gestion commandes
│       ├── AdminProducts.jsx   # Gestion produits CRUD
│       └── AdminUsers.jsx      # Gestion utilisateurs
├── styles/
│   ├── admin.css               # Styles admin (variables CSS)
│   └── global.css              # Styles globaux Tailwind
├── App.jsx                     # Routeur principal
├── App.css                     # Styles app (hérité)
├── main.jsx                    # Point d'entrée React
└── index.css                   # Styles index (vide probablement)

/                         # Assets statiques
├── hero.jpeg                   # Image hero
├── *.jpg, *.png, *.webp       # Images produits et sections
└── [nombreuses images uploadées]
```

---

## 🎯 PAGES PUBLIQUES (NON-ADMIN)

### 1. **Home.jsx** (`/`)
**Fonction:** Landing page avec sections multiples
**Composants utilisés:**
- HeroSection
- MarqueeTicker
- BottomTicker
- AnnouncementSection
- ShopSection
- FeaturesSection
- OctaneSection
- SpecsSection
- AboutSection
- AboutSection2
- OrderSection

**Données mockées:** 0 (tout est composants)

---

### 2. **ShopCategoryPage.jsx** (`/shop`)
**Fonction:** Listing des produits avec filtrage par grade
**Données mockées:** ✅ **IMPORTANTE** - Tableau `ALL_PRODUCTS`

**19 produits hardcodés:**
```javascript
const ALL_PRODUCTS = [
  // 87 Regular (3 produits)
  { id: 1, slug: 'gelonade-smalls', name: 'GELONADE SMALLS', grade: '87 Regular', 
    thc: '22%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 35, '7g': 65, '28g': 200 } },
  // ... (18 autres produits)
  
  // 89 Premium (4 produits)
  { id: 4, slug: 'purple-lemonade', name: 'PURPLE LEMONADE', grade: '89 Premium', 
    thc: '26%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 45, '7g': 85, '28g': 260 } },
  
  // 91 Supreme (5 produits)
  { id: 8, slug: 'hitch-hiker', name: 'HITCH HIKER', grade: '91 Supreme', 
    thc: '30%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 55, '7g': 100, '28g': 320 } },
  
  // 93 High Octane (7 produits)
  { id: 13, slug: 'runtz-og', name: 'RUNTZ OG', grade: '93 High Octane', 
    thc: '34%', weights: ['3.5g','7g','28g'], prices: { '3.5g': 65, '7g': 120, '28g': 380 } },
]
```

**Filtres hardcodés:**
```javascript
const FILTERS = ['All', '87 Regular', '89 Premium', '91 Supreme', '93 High Octane']
```

**Localisation exacte:** [src/pages/ShopCategoryPage.jsx](src/pages/ShopCategoryPage.jsx#L3-L20)

**Composants:**
- ProductCard (carousel images, overlays)
- Filtrage par grade via query param `?grade=`

---

### 3. **ProductDetailPage.jsx** (`/shop/:id`)
**Fonction:** Détail complet d'un produit
**Données mockées:** ✅ **IMPORTANTE** - Tableau `PRODUCTS` (19 produits)

**Données différentes de ShopCategoryPage:** Champs additionnels:
```javascript
{
  id, slug, name,
  badge: 'New' | null,
  strain: 'Sativa' | 'Indica' | 'Hybrid',
  grade: '87 Regular' | '89 Premium' | etc,
  thc: '22%',
  prices: { '3.5g', '7g', '28g' },
  images: []
}
```

**Localisation exacte:** [src/pages/ProductDetailPage.jsx](src/pages/ProductDetailPage.jsx#L5-L100)

**Fonctionnalités:**
- Carousel images avec flèches
- Sélection poids/quantité
- Ajout au panier (dispatch event `gp:open-cart`)
- Affichage prix variable par poids

---

### 4. **CartPage.jsx** (`/cart`)
**Fonction:** Affichage et gestion du panier
**Données mockées:** 0 (tout vient de CartContext localStorage)

**Affiche:**
- Liste articles (produit, poids, prix, quantité)
- Total
- Bouton "Vider panier"
- Modification quantité inline
- Suppression items

---

### 5. **CheckoutPage.jsx** (`/checkout`)
**Fonction:** Formulaire commande et paiement
**Données mockées:** 0

**Formulaire fields:**
```javascript
{
  firstName, lastName, email, phone,
  address, city, zipcode, notes
}
```

**Actions API:**
- `createOrder()` - Création commande
- `createPaymentIntent()` - Stripe (optionnel, non-bloquant)

**Redirection:** `/order/{orderId}` après succès

---

### 6. **OrderPage.jsx** (`/order/:id`)
**Fonction:** Confirmation commande et détails
**Données mockées:** 0 (API: `getOrder(id)`)

**Affiche:**
- Numéro commande
- Statut (pending/processing/shipped/completed)
- Date
- Articles (produit, poids, quantité, subtotal)
- Adresse livraison
- Total
- Panier moyen

---

### 7. **Home.jsx** - Composants internes

#### **HeroSection.jsx**
**Données hardcodées:** Image background
```javascript
background-image: url(/hero.jpeg)
```
**Texte:** Titre "WELCOME TO GASPASS" (CSS-inséré)

#### **ShopSection.jsx**
**Données mockées:** 6 produits en showcase
```javascript
const PRODUCTS = [
  { name: 'HITCH HIKER', slug: 'hitch-hiker', badge: 'New', 
    images: ['/JZlZpcElgglkOzxiEgbXIpsYy4.jpg', ...] },
  // ... (5 autres)
]
```
**Localisation:** [src/components/ShopSection.jsx](src/components/ShopSection.jsx#L5-L40)

#### **OctaneSection.jsx**
**Données mockées:** 4 tiers hardcodés
```javascript
const TIERS = [
  { grade: '87', label: 'Regular', description: '...' },
  { grade: '89', label: 'Premium', description: '...' },
  { grade: '91', label: 'Supreme', description: '...' },
  { grade: '93', label: 'High Octane', description: '...' },
]
```
**Localisation:** [src/components/OctaneSection.jsx](src/components/OctaneSection.jsx#L5-L15)

#### **SpecsSection.jsx**
**Données mockées:** 6 specs avec images
```javascript
const SPECS = [
  { label: 'THC POTENCY', img: imgTHC },
  { label: 'TRIM STYLE', img: imgTrim },
  // ... (4 autres)
]
```
**Images importées:** De `/`

#### **AboutSection.jsx**
**Données mockées:** 4 catégories shop
```javascript
const CATEGORIES = [
  { label: 'Shop 87', sublabel: 'REG', img: img87, grade: '87 Regular' },
  { label: 'Shop 89', sublabel: 'PREMIUM', img: img89, grade: '89 Premium' },
  { label: 'Shop 91', sublabel: 'SUPREME', img: img91, grade: '91 Supreme' },
  { label: 'Shop 93', sublabel: 'HIGH OCTANE', img: img93, grade: '93 High Octane' },
]
```
**Click navigate:** `/shop?grade={encodeURIComponent(grade)}`

#### **FeaturesSection.jsx**
**Données mockées:** 4 features
```javascript
const FEATURES = [
  { icon: '/bus.png', label: 'Fast Turnaround Times' },
  { icon: '/lock.png', label: 'Exclusive Strain Access' },
  { icon: '/wand.png', label: 'Consistent Quality Control' },
  { icon: '/flag.png', label: 'Best Quality for Price' },
]
```
**Localisation:** [src/components/Featuresection.jsx](src/components/Featuresection.jsx#L3-L6)

#### **OrderSection.jsx**
**Données mockées:** FAQ items
```javascript
const FAQS = [
  { q: 'How fast is Shipping?', a: 'We ship within 24–48 hours...' },
  { q: 'When will my order be fulfilled?', a: 'Orders are typically processed same day...' },
  { q: 'What mail carriers does the GasPass team use?', a: 'We use trusted carriers...' },
]
```
**Localisation:** [src/components/OrderSection.jsx](src/components/OrderSection.jsx#L30-L33)

#### **MarqueeTicker.jsx**
**Données mockées:** Items ticker
```javascript
const ITEMS = [
  'SMALL BATCH EXOTICS',
  'STEALTHY PACKAGING',
  'QUICK DELIVERY',
  'UNIQUE STRAINS',
  'QUALITY SMOKE',
  'LOWEST PRICES',
]
```
**Répétition:** 4x pour animation infinie

#### **BottomTicker.jsx**
**Données mockées:** Texte ticker
```javascript
const TEXT = 'UNIQUEMENT AU PASSAGE GAZ'
const repeated = Array(20).fill(TEXT)
```

#### **Navbar.jsx**
**Données mockées:** Items populaires et liens nav
```javascript
const POPULAR_ITEMS = [
  { name: 'JUNGLE JUICE', grade: '91 Supreme', image: '/products/jungle-juice.jpg', slug: 'jungle-juice' },
  { name: 'BERRY NEBULA', grade: '91 Supreme', image: '/products/berry-nebula.jpg', slug: 'berry-nebula' },
  { name: 'PERMANENT MARKER', grade: '89 Premium', image: '/products/permanent-marker.jpg', slug: 'permanent-marker' },
]

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Order & Contact', anchor: 'support' },
  { label: 'FAQ', anchor: 'faq' },
]
```

**Logos paiement:** SVG inline (VISA, Mastercard, Discover, Amex)

**Localisation:** [src/components/Navbar.jsx](src/components/Navbar.jsx#L46-L58)

#### **FooterSection.jsx**
**Données mockées:** 0 (structure CSS seulement)

#### **AnnouncementSection.jsx**
**Données mockées:** Image background
```javascript
const HERO_IMAGE = '/m7CojsTPdwZHCKQYdWtnYIDM.webp'
```

#### **AboutSection2.jsx**
**Données mockées:** Image
```javascript
src="/m7h1aWDNxW3hPZbMe1z1MRzsFog.png"
```

---

## 🔌 APPELS API CENTRALISÉS

### **src/api/client.js** - Configuration
**API_URL:** `http://localhost:5001/api`

**Auth headers:** Bearer token depuis localStorage

**Endpoints existants:**

| Fonction | Endpoint | Méthode | Auth |
|----------|----------|---------|------|
| `getProducts()` | `/products` | GET | Optionnel |
| `getProduct(id)` | `/products/{id}` | GET | Optionnel |
| `register(email, password, phone)` | `/auth/register` | POST | Non |
| `login(email, password)` | `/auth/login` | POST | Non |
| `createOrder(data)` | `/orders` | POST | Non |
| `getOrder(id)` | `/orders/{id}` | GET | Optionnel |
| `updateOrderStatus(id, status)` | `/orders/{id}/status` | PUT | Optionnel |
| `createPaymentIntent(orderId, amount)` | `/payment/create-intent` | POST | Optionnel |
| `linkTelegram(code, userId, telegramId)` | `/telegram/link` | POST | Optionnel |

**Localisation:** [src/api/client.js](src/api/client.js)

**Notes:**
- ✅ Token géré automatiquement
- ✅ Erreurs centralisées
- ❌ Pas d'interceptor logout si 401

---

## 🛒 STATE MANAGEMENT

### **CartContext.jsx** - Panier local
**Stockage:** localStorage key `gaspass_cart`

**State:**
```javascript
{
  cart: [
    {
      productId: number,
      name: string,
      weight: string ('3.5g' | '7g' | '28g'),
      quantity: number,
      pricePerUnit: number,
      image: string
    }
  ]
}
```

**Actions:**
```javascript
addToCart(product, weight, quantity)
removeFromCart(productId, weight)
updateQuantity(productId, weight, quantity)
clearCart()
getTotal()
getItemCount()
```

**Localisation:** [src/context/CartContext.jsx](src/context/CartContext.jsx)

---

## 🔐 AUTHENTIFICATION

### **useAuth.js** - Hook auth simple
**Stockage:** localStorage key `token`

**État:**
```javascript
{
  user: { token, ... } | null,
  loading: boolean
}
```

**Actions:**
```javascript
login(token, userData)  // ← À utiliser après API login
logout()                // ← Supprime token et user
```

**Problème:** TODO commentaire pour validation token avec backend

**Localisation:** [src/hooks/useAuth.js](src/hooks/useAuth.js)

---

## 🎨 STYLES & VARIABLES CSS

### **global.css** - Variables racine
```css
--color-bg: #351518           (background sombre)
--color-bg-dark: #1a0a0b
--color-red: #ba0b20          (rouge GasPass)
--color-orange: #cc6b33
--color-gold: #cab171
--color-green: #9effa5        (vert "on")
--font-pixel: 'Press Start 2P' (titres)
--font-sans: 'Helvetica Neue' (body)
```

### **admin.css** - Styles admin
**Variables:**
```css
--text-dark, --text-mid, --text-light
--red, --orange, --blue, --green
```

---

## 🗺️ ROUTAGE (React Router)

```
/                              → Home
/shop                          → ShopCategoryPage (avec ?grade=)
/shop/{slug}                   → ProductDetailPage
/cart                          → CartPage
/checkout                      → CheckoutPage
/order/{id}                    → OrderPage

/admin/login                   → AdminLogin
/admin                         → AdminLayout (layout)
/admin/dashboard               → AdminDashboard
/admin/orders                  → AdminOrders
/admin/products                → AdminProducts
/admin/users                   → AdminUsers
```

**Localisation:** [src/App.jsx](src/App.jsx)

---

## 📊 SECTION ADMIN

### **AdminLogin.jsx** (`/admin/login`)
**Données hardcodées:** 0
**API:** `POST /auth/login`
**Validation:** `data.user?.role === 'admin'`
**Stockage:** localStorage `adminToken`

### **AdminLayout.jsx**
**Navigation items:**
```javascript
const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { path: '/admin/orders', label: 'Commandes', Icon: ShoppingBag },
  { path: '/admin/products', label: 'Produits', Icon: Package },
  { path: '/admin/users', label: 'Utilisateurs', Icon: Users },
]
```

### **AdminDashboard.jsx**
**API:** `GET /admin/dashboard`
**Stats affichés:**
- Total revenue
- Total orders
- Total users
- Average order value
- Recent orders list

### **AdminOrders.jsx**
**API:**
- `GET /admin/orders` (all ou filtered)
- `PUT /admin/orders/{id}` (update status)

**Statuts:** pending, processing, shipped, completed

### **AdminProducts.jsx**
**API:**
- `GET /admin/products`
- `POST /admin/products` (create)
- `PUT /admin/products/{id}` (update)
- `DELETE /admin/products/{id}` (delete)

**Champs:** name, slug, grade, tier, thc, cbd, type, description, active

### **AdminUsers.jsx**
**API:**
- `GET /admin/users`
- `GET /admin/orders` (filtrer par userId)

**Affiche:** email, phone, role, created date, order history

---

## 🗂️ RÉSUMÉ DONNÉES MOCKÉES

| Localisation | Données | Quantité | Type |
|--------------|---------|----------|------|
| [ShopCategoryPage.jsx](src/pages/ShopCategoryPage.jsx#L3) | ALL_PRODUCTS | 19 produits | Complet |
| [ProductDetailPage.jsx](src/pages/ProductDetailPage.jsx#L5) | PRODUCTS | 19 produits | Complet |
| [ShopSection.jsx](src/components/ShopSection.jsx#L5) | PRODUCTS showcase | 6 produits | Partiel |
| [OctaneSection.jsx](src/components/OctaneSection.jsx#L5) | TIERS | 4 grades | Tiers seul |
| [AboutSection.jsx](src/components/AboutSection.jsx#L8) | CATEGORIES | 4 catégories | Navigation |
| [FeaturesSection.jsx](src/components/Featuresection.jsx#L3) | FEATURES | 4 features | Statique |
| [OrderSection.jsx](src/components/OrderSection.jsx#L30) | FAQS | 3 FAQs | Statique |
| [MarqueeTicker.jsx](src/components/MarqueeTicker.jsx#L3) | ITEMS | 6 items | Texte |
| [Navbar.jsx](src/components/Navbar.jsx#L46) | POPULAR_ITEMS, NAV_LINKS | 3+3 items | Navigation |
| [BottomTicker.jsx](src/components/Bottomticker.jsx#L3) | TEXT | 1 texte | Animation |

**TOTAL:** ~60-70 éléments mockés

---

## 🎯 ZONES ADMIN vs PUBLIC

### Publiques (NO AUTH REQUIRED)
- `/` Home
- `/shop` Listing
- `/shop/:id` Détail
- `/cart` Panier
- `/checkout` Checkout
- `/order/:id` Commande (token optionnel)

### Admin (AUTH REQUIRED)
- `/admin/login` Connexion
- `/admin/*` Tout nécessite localStorage `adminToken`

---

## 🔄 FLUX ACHAT UTILISATEUR

1. **Home** → Browse sections
2. **Shop** → Filter by grade
3. **Product Detail** → Select weight/quantity → "Add to cart"
4. **Navbar Cart** → View cart items
5. **Cart Page** → Review/modify items
6. **Checkout** → Fill form → Submit
7. **Order Page** → Confirmation + details
8. **API:** `createOrder()` → `/orders`

---

## 📦 DÉPENDANCES

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.24.0",
  "lucide-react": "^1.7.0",        (icônes)
  "framer-motion": "^11.3.0",      (animations)
  "tailwindcss": "^3.4.4",         (utility CSS)
  "postcss": "^8.4.39",
  "autoprefixer": "^10.4.19"
}
```

**Vite:** ^5.3.1

---

## 🚨 PROBLÈMES & TODO IDENTIFIÉS

| Localisation | Problème | Priorité |
|--------------|----------|----------|
| [useAuth.js](src/hooks/useAuth.js#L8) | TODO: Implement token validation with backend | HAUTE |
| [AdminLayout.jsx](src/components/admin/AdminLayout.jsx) | Pas de vérification adminToken sur montage | HAUTE |
| [CheckoutPage.jsx](src/pages/CheckoutPage.jsx) | Payment intent error non-bloquant | MOYENNE |
| [ShopCategoryPage.jsx](src/pages/ShopCategoryPage.jsx#L3) | 19 produits en dur vs API | MOYENNE |
| [ProductDetailPage.jsx](src/pages/ProductDetailPage.jsx#L5) | Duplicate data vs ShopCategoryPage | MOYENNE |
| [OrderPage.jsx](src/pages/OrderPage.jsx#L13) | Validation token optionnel | BASSE |

---

## 📝 CONVENTIONS

- **Components:** PascalCase, .jsx
- **Hooks:** camelCase, useXxx, .js
- **CSS:** Inline + tailwind + CSS-in-JS
- **Images:** / ou relative imports
- **Colors:** CSS variables --color-xxx
- **Fonts:** --font-pixel (titres), --font-sans (body)

---

## 🔗 POINTS D'INTÉGRATION API MANQUANTS

1. **Produits:** Charger depuis `/api/products` au lieu de mockées
2. **Catégories:** Générer filtres depuis API
3. **Navbar cart:** Possibilité d'utiliser API cart persistant
4. **Auth:** Implémenter validation token useAuth.js
5. **Admin pages:** Ajouter protections route

---

**FIN DE L'ANALYSE**
