# NOIRÉ — Premium Perfume Landing Page & E-Commerce Catalog

A modern, responsive, luxury-themed landing page and multi-item product catalog designed for a fictional premium perfume brand targeting the Egyptian market. Built entirely with clean semantic HTML5, modern CSS3, and Vanilla JavaScript with zero external frameworks, libraries, or build tools required.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Product Catalog & Data Structure](#product-catalog--data-structure)
  - [How to Add New Products](#how-to-add-new-products)
  - [How to Edit Product Prices & Promotions](#how-to-edit-product-prices--promotions)
  - [How to Replace Product Images](#how-to-replace-product-images)
  - [How to Customize Olfactory Notes](#how-to-customize-olfactory-notes)
- [Shopping Cart & Multi-Product Checkout](#shopping-cart--multi-product-checkout)
  - [Interactive Product Details Modal](#interactive-product-details-modal)
  - [Slide-Out Shopping Cart Drawer](#slide-out-shopping-cart-drawer)
  - [Dynamic Order Summary Synchronization](#dynamic-order-summary-synchronization)
- [WhatsApp Checkout Integration](#whatsapp-checkout-integration)
  - [Configuring Your WhatsApp Number](#configuring-your-whatsapp-number)
  - [Multi-Item Order Message Format](#multi-item-order-message-format)
- [General Configuration Guide](#general-configuration-guide)
  - [Changing Delivery & Payment Policies](#changing-delivery--payment-policies)
  - [Replacing Customer Testimonials](#replacing-customer-testimonials)
- [Demo vs. Production Features](#demo-vs-production-features)
- [Deployment Guide](#deployment-guide)
  - [Free Static Hosting Options](#free-static-hosting-options)
  - [Pre-Launch Verification Checklist](#pre-launch-verification-checklist)
- [Browser Support](#browser-support)
- [Technologies Used](#technologies-used)
- [License & Credits](#license--credits)

---

## Overview

**NOIRÉ** embodies high-end fragrance craftsmanship and digital elegance. Tailored for discerning clientele in the Egyptian luxury market (Cairo, Giza, Alexandria, and nationwide), this website offers a seamless product discovery, multi-item shopping cart, and one-click WhatsApp order generation flow.

- **Stack:** Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- **Build Requirements:** None (no Node.js, Webpack, Vite, or npm installs necessary)
- **Target Audience:** Luxury perfume consumers across Egypt
- **Design Aesthetic:** Deep black (`#0B0B0B`), dark charcoal (`#151515`), metallic gold accents (`#D4AF37`), and crisp white typography

---

## Key Features

- **Fully Responsive Architecture:** Mobile-first layout with smooth transitions across mobile screens, tablets, laptops, and 4K displays.
- **Featured Signature Showcase:** Hero and dedicated highlight section for *NOIRÉ Signature Eau de Parfum* (100ml / EGP 1,499).
- **"You May Also Like" Related Products Catalog:** Dynamic CSS Grid displaying additional fragrances (*Oud Prestige*, *Velvet Rose*, *Aqua Fresh*, *Midnight Amber*) generated directly from a single JavaScript array.
- **Product Details Modal:** Accessible pop-up modal revealing high-resolution bottle photography, fragrance pyramid (Top, Heart, and Base notes), and instant "Add to Order" quantity selector.
- **Multi-Product Shopping Cart:**
  - Real-time cart badge counter in the navigation bar.
  - Slide-out cart drawer with item thumbnails, steppers (+ / -), item subtotals, and remove buttons.
  - Automatic subtotal calculation in Egyptian Pounds (EGP).
  - Elegant empty-cart state with a prompt to explore the collection.
  - Non-intrusive luxury toast notifications when adding items.
- **Dynamic Checkout Order Summary:** Live itemized breakdown in the order section automatically synchronized with cart contents.
- **Client-Side Form Validation:** Validates required fields, full delivery addresses, and Egyptian mobile phone format (`01XXXXXXXXX`).
- **Itemized WhatsApp Order Dispatch:** Automatically formats and URL-encodes an order message containing every selected product, individual quantity, unit price, item subtotal, total order amount, and customer shipping details.
- **Accessible FAQ Accordion:** Smooth CSS height animations with keyboard navigation (`Enter`, `Space`, `Tab`) and ARIA expanded state attributes.
- **Scroll Animations:** Intersection Observer API triggers smooth fade-up animations as users scroll through the page.
- **Accessibility & Reduced Motion:** Respects `prefers-reduced-motion: reduce`, includes `:focus-visible` gold outlines, and utilizes semantic HTML5 elements.

---

## Project Structure

```
noire-perfume-landing-page/
├── index.html          # Main HTML structure with semantic sections and modal/cart markup
├── style.css           # Mobile-first stylesheet with luxury dark/gold design tokens
├── script.js           # Vanilla JS: product catalog array, cart state, modal, WhatsApp logic
├── assets/
│   └── images/         # Local perfume images directory
└── README.md           # Comprehensive project documentation
```

---

## Getting Started

1. **Download or Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/noire-perfume-landing-page.git
   cd noire-perfume-landing-page
   ```

2. **Open Directly in Browser:**
   - Double-click `index.html` or drag-and-drop it into any modern web browser.
   - No build step, node modules, compilation, or server setup is required.

3. **Local Development Server (Recommended for live editing):**
   - **VS Code:** Right-click `index.html` and select **"Open with Live Server"**.
   - **Python 3:** Run `python -m http.server 8000` in terminal and visit `http://localhost:8000`.
   - **Node.js:** Run `npx serve` in the project root.

---

## Product Catalog & Data Structure

All demo products are stored in a clean JavaScript array of objects near the top of [script.js](file:///c:/Users/bosil/OneDrive/Desktop/landing_padg/noire-perfume-landing-page/script.js#L27-L114):

```javascript
const PRODUCTS = [
  {
    id: 'noire-signature',
    name: 'NOIRÉ Signature Eau de Parfum',
    description: 'A sophisticated fragrance blending bergamot, jasmine, and velvety cedarwood...',
    price: 1499,
    oldPrice: 1799,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
    category: 'Signature Oriental',
    volume: '100 ml',
    topNotes: 'Bergamot, Sun-drenched Citrus',
    heartNotes: 'Jasmine Sambac, Warm Spices',
    baseNotes: 'Amber, Musk, Smoked Cedarwood',
    featured: true
  },
  {
    id: 'noire-oud-prestige',
    name: 'NOIRÉ Oud Prestige',
    description: 'A majestic fusion of rare Cambodian oud, smoked birch, and velvety leather...',
    price: 1799,
    oldPrice: 2199,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80',
    category: 'Woody Oriental',
    volume: '100 ml',
    topNotes: 'Saffron, Incense, Pink Peppercorn',
    heartNotes: 'Royal Oud, Smoked Birch, Taif Rose',
    baseNotes: 'Dark Leather, Patchouli, Golden Amber',
    featured: false
  },
  // Additional products...
];
```

### How to Add New Products
To add a new fragrance to the catalog, simply append a new object to the `PRODUCTS` array in `script.js`:

```javascript
{
  id: 'noire-imperial-musk',
  name: 'NOIRÉ Imperial Musk',
  description: 'An ethereal veil of white musk, crisp iris, and creamy sandalwood.',
  price: 1350,
  oldPrice: 1600, // Optional promotional price
  image: 'https://images.unsplash.com/photo-...', // Or 'assets/images/imperial-musk.webp'
  category: 'Musk & Powdery',
  volume: '100 ml',
  topNotes: 'White Peach, Bergamot',
  heartNotes: 'Florentine Iris, White Lily',
  baseNotes: 'Pure Musk, Bourbon Vanilla, Sandalwood',
  featured: false // Set to false to render in the Related Products grid
}
```
The page automatically renders the new card in the catalog grid, wires up its "View Details" modal, and enables full cart support with no HTML changes needed.

### How to Edit Product Prices & Promotions
- Update the `price` property (integer in Egyptian Pounds, e.g., `1799`).
- Update or omit `oldPrice`. If omitted, the promo strikethrough will disappear automatically.

### How to Replace Product Images
- **Remote CDN Images:** Replace the `image` string with your preferred HTTPS image URL.
- **Local Assets:** Save your optimized product photo into `assets/images/my-perfume.jpg` and set:
  ```javascript
  image: 'assets/images/my-perfume.jpg',
  ```

### How to Customize Olfactory Notes
Edit the `topNotes`, `heartNotes`, and `baseNotes` strings. These are dynamically injected into the product details modal when the customer clicks **"View Details"**.

---

## Shopping Cart & Multi-Product Checkout

### Interactive Product Details Modal
- Clicking **"View Details"** on any card opens an accessible modal with the fragrance's image, notes pyramid, description, and quantity controls.
- Keyboard accessible: Closes with the `Escape` key, modal backdrop click, or the close button (`X`). Traps focus responsibly.

### Slide-Out Shopping Cart Drawer
- Triggered by clicking the cart icon in the navigation bar (`#navCartBtn`), clicking **"View Cart"** inside toast notifications, or clicking **"Edit Cart"** in the order section.
- Supports adjusting quantities (+ / -) directly inside the drawer.
- Shows itemized prices and subtotal in Egyptian Pounds.
- Includes a **"Proceed to Checkout"** button that smoothly scrolls directly to the order form.

### Dynamic Order Summary Synchronization
- The `.order-summary-panel` in the checkout section is fully reactive.
- Adding, updating, or removing fragrances instantly recalculates item counts, individual subtotals, and the total order subtotal.
- If the cart is empty, a helpful message guides the user to select a fragrance first.

---

## WhatsApp Checkout Integration

### Configuring Your WhatsApp Number
All direct orders and inquiry links route through the WhatsApp Click-to-Chat API. Update the phone number in:

1. **In `script.js`:**
   Locate `WHATSAPP_NUMBER` at line 15:
   ```javascript
   const WHATSAPP_NUMBER = '20XXXXXXXXXX'; // Replace with your number (country code + number without +)
   ```
2. **In `index.html`:**
   Search for `20XXXXXXXXXX` in the floating WhatsApp button and footer contact link:
   ```html
   <a href="https://wa.me/20XXXXXXXXXX" class="whatsapp-float" ...>
   ```
   *Format example for Egypt:* `201012345678` or `201123456789`.

### Multi-Item Order Message Format
When the customer submits their order or clicks **"Order via WhatsApp"**, the script compiles all cart items and customer shipping details into an organized, URL-encoded payload:

```text
Hello NOIRÉ! I would like to place an order:

══════ ORDER SUMMARY ══════
1. NOIRÉ Signature Eau de Parfum (100ml)
   Qty: 1 × EGP 1,499 = EGP 1,499
2. NOIRÉ Oud Prestige (100ml)
   Qty: 2 × EGP 1,799 = EGP 3,598
────────────────────────────
Total Fragrances: 3
Total Order Subtotal: EGP 5,097
* Delivery fees calculated separately upon confirmation.

══════ DELIVERY DETAILS ══════
Client Name: Karim El-Sayed
Mobile Phone: 01012345678
City / Governorate: Cairo
Delivery Address: 15 El-Tahrir Street, Dokki, Floor 4, Apt 12
Special Notes: Please call before arrival

Please confirm product availability and dispatch timing. Thank you!
```

---

## General Configuration Guide

### Changing Delivery & Payment Policies
- In `index.html`, locate the `#faq` section and replace the `[Configure:` placeholders with your store's specific delivery timeframes (e.g., Cairo/Giza: 24–48 hours, Alexandria & Provinces: 2–4 days) and accepted payment methods (Cash on Delivery, InstaPay, Credit Cards).

### Replacing Customer Testimonials
- Search for `.review-card` in `index.html` and update client quotes, initials, and locations with genuine customer feedback.

---

## Demo vs. Production Features

| Feature | Status | Implementation Details |
|---|---|---|
| **Product Showcase & Catalog** | ✅ Production Ready | Generated dynamically from `PRODUCTS` array |
| **Olfactory Details Modal** | ✅ Production Ready | Dynamic modal with olfactory breakdown |
| **Shopping Cart System** | ✅ Production Ready | In-memory multi-product cart with live recalculation |
| **Form Validation** | ✅ Production Ready | Validates required inputs & Egyptian phone regex |
| **WhatsApp Order Integration** | ⚠️ Configuration | Replace `20XXXXXXXXXX` with store owner's real WhatsApp |
| **Payment Gateway** | ❌ Requires Backend | Optional (Stripe, Paymob, Fawry, InstaPay) |
| **Database Order Storage** | ❌ Requires Backend | For server-side inventory and order records |
| **Sample Testimonials** | ⚠️ Demo | Replace with verified client reviews before public launch |

---

## Deployment Guide

### Free Static Hosting Options
Since NOIRÉ is built with pure HTML5, CSS3, and Vanilla JavaScript, it can be deployed for free on any static web host:

1. **GitHub Pages:**
   - Push code to GitHub repository.
   - Go to **Settings > Pages > Branch: main / root** and click Save.
2. **Netlify:**
   - Drag-and-drop the `noire-perfume-landing-page` folder at [netlify.com/drop](https://app.netlify.com/drop) for instant global CDN deployment.
3. **Vercel:**
   - Deploy with `npx vercel` or link your GitHub repository on [vercel.com](https://vercel.com).
4. **Cloudflare Pages:**
   - Connect your GitHub repository with build command empty and output directory set to `/`.

### Pre-Launch Verification Checklist
- [ ] Replace `20XXXXXXXXXX` with the verified WhatsApp number in `script.js` and `index.html`.
- [ ] Confirm perfume names, descriptions, prices, and high-resolution images in `script.js`.
- [ ] Verify shipping rates and governorates in `index.html`.
- [ ] Replace demo testimonials with genuine customer feedback.
- [ ] Remove demo badges from product cards and footer disclaimer notice if launching live.
- [ ] Test the entire order flow on mobile and desktop devices.

---

## Browser Support

- **Google Chrome:** 80+
- **Mozilla Firefox:** 80+
- **Apple Safari:** 14+ (macOS & iOS)
- **Microsoft Edge:** 80+
- **Samsung Internet:** All modern versions

---

## Technologies Used

- **HTML5:** Semantic architecture, ARIA dialog landmarks, SEO meta tags, Open Graph cards.
- **CSS3:** Custom Properties (CSS variables), CSS Grid, Flexbox, hardware-accelerated animations, glassmorphism.
- **Vanilla JavaScript (ES6+):** Object-oriented state management, IntersectionObserver, event delegation.
- **Google Fonts:**
  - *Playfair Display* — Editorial serif for luxury typography.
  - *Inter* — Clean modern sans-serif for UI legibility.

---

## License & Credits

- **License:** Open portfolio and commercial demo license. Feel free to use and modify for your personal or client projects.
- **Imagery:** Luxury fragrance photography sourced from Unsplash.
- **Icons:** Custom lightweight inline SVGs.

*Crafted as a senior front-end portfolio project showcasing luxury e-commerce UI/UX best practices.*
#   l a n d i n g _ p a g e s  
 