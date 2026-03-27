# Gas Pass Clone — Vite + React

Clone fidèle de gaspass.co construit avec Vite, React, et Tailwind CSS.

## Stack
- **React 18** + **Vite 5**
- **Tailwind CSS** — design tokens Gas Pass intégrés
- **React Router DOM** — navigation SPA
- **Framer Motion** — prêt à l'emploi pour les animations avancées

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de dev
npm run dev

# 3. Build de production
npm run build
```

## Routes (extraites du script_main Framer)

| Route | Page |
|-------|------|
| `/` | Home — toutes les sections |
| `/shop/categories/:id` | ShopCategoryPage — navigation par grade octane |
| `/shop/:id` | ProductDetailPage — fiche produit complète |

## Pages

- `Home.jsx` — assemblage de toutes les sections
- `ShopCategoryPage.jsx` — onglets 87/89/91/93, liste de strains filtrée
- `ProductDetailPage.jsx` — fiche produit : THC/CBD, terpènes, sélecteur de poids, CTA ordre

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation fixe avec blur au scroll
│   ├── HeroSection.jsx     # Hero principal avec animation spring
│   ├── MarqueeTicker.jsx   # Ticker horizontal infini
│   ├── AnnouncementSection.jsx  # Bloc annonce officielle
│   ├── ShopSection.jsx     # Grille produits (6 strains)
│   ├── OctaneSection.jsx   # Système 87/89/91/93 interactif
│   ├── SpecsSection.jsx    # Specs cannabis + features
│   ├── AboutSection.jsx    # Histoire de la marque
│   ├── OrderSection.jsx    # Comment commander + FAQ
│   └── Footer.jsx          # Footer complet
├── hooks/
│   └── useReveal.js        # Hook IntersectionObserver (scroll animations)
├── pages/
│   └── Home.jsx            # Page d'accueil assemblant toutes les sections
├── styles/
│   └── global.css          # Variables CSS, animations globales
├── App.jsx
└── main.jsx
```

## Design Tokens Gas Pass

| Token | Valeur |
|-------|--------|
| Background | `#351518` |
| Background dark | `#1a0a0b` |
| Rouge | `#ba0b20` |
| Orange | `#cc6b33` |
| Or | `#cab171` |
| Vert néon | `#9effa5` |
| Vert muted | `#516c58` |
| Font display | `Press Start 2P` (pixel) |

## Sections reproduites

1. ✅ Navbar sticky avec blur
2. ✅ Hero — headline animée + CTA
3. ✅ Marquee ticker — labels infinies
4. ✅ Announcement — bloc lancement Gas Pass
5. ✅ Shop — grille 6 strains avec hover
6. ✅ Octane system — 87/89/91/93 interactif (click to expand)
7. ✅ Specs — tableau cannabis specs
8. ✅ About — story de la marque
9. ✅ How to Order + FAQ accordion
10. ✅ Footer complet
