# Test Guide - GasPass E-Commerce Cart System

## ✅ Complete Cart System Implementation

Your GasPass e-commerce platform now has a **fully functional cart and checkout flow**. Here's what's been implemented:

### Features Implemented

#### 1. **Product Detail Page - Add to Cart**
- ✅ Click on a product to view details
- ✅ Select weight (3.5g, 7g, 14g, 28g, QP, HP, LB)
- ✅ Click "ADD {weight} TO CART" button
- ✅ Visual feedback "✓ ADDED TO CART" for 2 seconds
- **File:** [src/pages/ProductDetailPage.jsx](src/pages/ProductDetailPage.jsx)

#### 2. **Cart Context - Global State**
- ✅ Stores all cart items with localStorage persistence
- ✅ Auto-saves/loads from browser storage
- ✅ Functions: addToCart, removeFromCart, updateQuantity, clearCart
- **File:** [src/context/CartContext.jsx](src/context/CartContext.jsx)

#### 3. **Navbar - Real-time Badge**
- ✅ Shows cart item count in red badge
- ✅ Updates instantly when items added/removed
- ✅ Clean dark theme matching dashboard
- **File:** [src/components/Navbar.jsx](src/components/Navbar.jsx)

#### 4. **Cart Page**
- ✅ Display all items in a table (Name, Weight, Price, Quantity, Total)
- ✅ Modify quantities with input controls
- ✅ Remove items with × button
- ✅ Clear entire cart
- ✅ Summary sidebar with subtotal and total
- ✅ Continue shopping button
- **File:** [src/pages/CartPage.jsx](src/pages/CartPage.jsx)

#### 5. **Checkout Page**
- ✅ Form for personal info (first/last name, email, phone)
- ✅ Shipping address inputs (address, city, zipcode)
- ✅ Special notes textarea
- ✅ Order summary showing all items
- ✅ Creates order via API: `POST /api/orders`
- ✅ Creates payment intent: `POST /api/payment/create-intent`
- ✅ Clears cart on success
- ✅ Redirects to order confirmation page
- **File:** [src/pages/CheckoutPage.jsx](src/pages/CheckoutPage.jsx)

#### 6. **Order Confirmation Page**
- ✅ Shows order number and status
- ✅ Lists all ordered items with prices
- ✅ Displays shipping address
- ✅ Shows payment status
- ✅ Date and next steps
- ✅ Link back to shop
- **File:** [src/pages/OrderPage.jsx](src/pages/OrderPage.jsx)

### Design Consistency

**Color Scheme (System-wide):**
- Dark Background: `#0a0a0a`
- Success/Primary: `#9effa5` (Green)
- Danger/Attention: `#ba0b20` (Red)
- Text: White with rgba variations for hierarchy

**Components Using Consistent Design:**
- ✅ Navbar (sticky header with cart badge)
- ✅ Admin Dashboard (matching dark theme)
- ✅ Cart Page
- ✅ Checkout Page
- ✅ Order Page
- ✅ Product Detail Page

### Testing Flow

```
1. Browse Home page → Click product card
2. ProductDetailPage: Select weight, click "ADD TO CART"
3. Navbar: Badge updates showing item count
4. Click cart icon (🛒) → CartPage
5. Review items, adjust quantities if needed
6. Click "Passer la commande" button
7. CheckoutPage: Fill form with:
   - First Name: "Jean"
   - Last Name: "Dupont"
   - Email: "jean@example.com"
   - Phone: "+33612345678"
   - Address: "123 Rue de Paris"
   - City: "Paris"
   - Zipcode: "75001"
   - Notes: (optional)
8. Click "Procéder au paiement"
9. OrderPage: See confirmation with order number
10. Backend API: Check if order created in database
```

### URLs to Test

| Page | URL |
|------|-----|
| Products | `/` or `/shop/categories/91` |
| Product Detail | `/shop/hitch-hiker`, `/shop/sundae-driver` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Confirmation | `/order/1` (after checkout) |
| Admin Dashboard | `/admin` (login first) |

### Backend Requirements

For checkout to work, ensure:

1. **Backend running on port 5000:**
   ```bash
   cd backend
   npm start
   ```

2. **Environment variables set** (.env):
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/gaspass
   JWT_SECRET=your_secret_key
   STRIPE_SECRET_KEY=your_stripe_key
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   TELEGRAM_BOT_TOKEN=your_telegram_token (optional)
   ```

3. **Database seeded** with products:
   ```bash
   npm run db:seed
   ```

### API Endpoints Used

From [src/api/client.js](src/api/client.js):

```javascript
// Create new order
POST /api/orders
Body: {
  items: [ { productId, weight, quantity, pricePerUnit } ],
  total: 123.45,
  shippingAddress: { name, address, city, zipcode, phone, email }
}

// Get order details
GET /api/orders/:id

// Create payment intent
POST /api/payment/create-intent
Body: { orderId, amount }
```

### Frontend Stack

- React 18 with React Router v6
- Context API for state management (CartContext)
- Tailwind CSS + inline styles
- Vite (dev server on port 5173)

### What's NOT Done Yet

⏳ **Stripe Payment Modal** - The payment intent is created, but Stripe.js modal isn't integrated yet. For now, orders go to "pending payment" status.

⏳ **User Authentication** - Checkout currently allows anonymous orders. Add login/registration redirect for production.

⏳ **Email Notifications** - Order confirmation emails not yet sent. Integrate with email service (SendGrid, etc.)

⏳ **Inventory Tracking** - No stock updates when orders created. Add stock reduction on order confirmation.

### Database Schema (Orders Table)

```javascript
{
  id: UUID,
  orderNumber: "ORD-2024-001", // Unique for user signup
  userId: UUID, // Optional if anonymous
  items: [ // JSONB array
    {
      productId: number,
      weight: "7g",
      quantity: 1,
      pricePerUnit: 22,
      subtotal: 22
    }
  ],
  total: 22.00,
  status: "pending" | "processing" | "shipped" | "completed",
  paymentStatus: "pending" | "completed" | "failed",
  shippingAddress: {
    name: "Jean Dupont",
    address: "123 Rue de Paris",
    city: "Paris",
    zipcode: "75001",
    phone: "+33612345678",
    email: "jean@example.com"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sample Products in DB

| Name | Grade | Price (7g) | ID |
|------|-------|-----------|-----|
| HITCH HIKER | 91 | $22 | 1 |
| PURPLE LEMONADE | 89 | $20 | 2 |
| SUNDAE DRIVER | 93 | $24 | 3 |
| GELONADE SMALLS | 87 | $15 | 4 |
| PERMANENT MARKER | 93 | $24 | 5 |
| BISCOTTI CAKE | 91 | $22 | 6 |

### Next Steps (Recommended)

1. **[High Priority]** Test end-to-end checkout flow with real backend
2. **[High Priority]** Verify backend is creating orders correctly
3. **[Medium]** Integrate Stripe.js payment modal
4. **[Medium]** Add user authentication to checkout
5. **[Medium]** Setup email notifications for orders
6. **[Low]** Add inventory tracking/stock reduction
7. **[Low]** Implement order history page for users
8. **[Low]** Add Telegram order notifications

### Troubleshooting

**Cart not saving?**
- Check browser localStorage: Press F12 → Application → Local Storage → gaspass_cart

**Checkout failing?**
- Ensure API is running: `curl http://localhost:5000/api/products`
- Check browser console for errors (F12 → Console)
- Verify .env variables in backend

**Products not showing?**
- Run `npm run db:seed` in backend directory
- Check database connection in config/db.js

**Navbar badge not updating?**
- Clear browser cache (Ctrl+Shift+Delete)
- Verify CartProvider wraps app in App.jsx

---

**Status:** ✅ **Cart System Complete and Ready for Testing**

All core features implemented. Awaiting backend verification and payment integration.
