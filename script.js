/**
 * NOIRÉ - Luxury Perfume Landing Page & E-Commerce Catalog
 * Complete Interactive Functionality & Multi-Item Shopping Cart
 * Vanilla JavaScript (ES6+)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. CONSTANTS, CONFIGURATION & PRODUCT DATA STRUCTURE
  // =========================================================================

  // CONFIGURE: Replace with your actual WhatsApp phone number (international format without +)
  const WHATSAPP_NUMBER = '201552503285';

  const HEADER_OFFSET = 80; // Fixed header offset in pixels
  const MIN_QUANTITY = 1;
  const MAX_QUANTITY = 10;

  /**
   * DEMO PRODUCT CATALOG DATA STRUCTURE
   * Store owners can easily add, edit, or remove products by modifying this array.
   */
  const PRODUCTS = [
    {
      id: 'noire-signature',
      name: 'NOIRÉ Signature Eau de Parfum',
      description: 'A sophisticated fragrance blending bergamot, jasmine, and velvety cedarwood for an unforgettable signature presence.',
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
      description: 'A majestic fusion of rare Cambodian oud, smoked birch, and velvety leather creating an aura of timeless royalty.',
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
    {
      id: 'noire-velvet-rose',
      name: 'NOIRÉ Velvet Rose',
      description: 'Damask rose steeped in caramelized praline, pink pepper, and amberwood for an intoxicating and seductive floral indulgence.',
      price: 1299,
      oldPrice: 1599,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
      category: 'Floral Gourmand',
      volume: '100 ml',
      topNotes: 'Sparkling Bergamot, Pink Pepper',
      heartNotes: 'Damascena Rose, Sweet Praline, Violet',
      baseNotes: 'White Musk, Vanilla Bean, Amberwood',
      featured: false
    },
    {
      id: 'noire-aqua-fresh',
      name: 'NOIRÉ Aqua Fresh',
      description: 'Crisp marine breeze balanced with Mediterranean neroli and white musk, invoking the pristine coastal allure of Alexandria.',
      price: 999,
      oldPrice: 1250,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80',
      category: 'Fresh Aquatic',
      volume: '100 ml',
      topNotes: 'Calabrian Bergamot, Sea Salt, Lemon Peel',
      heartNotes: 'Egyptian Neroli, Rosemary, Clary Sage',
      baseNotes: 'Driftwood, White Musk, Crisp Amber',
      featured: false
    },
    {
      id: 'noire-midnight-amber',
      name: 'NOIRÉ Midnight Amber',
      description: 'Golden amber interwoven with black vanilla bourbon and sandalwood, creating a magnetic and sultry evening aura.',
      price: 1499,
      oldPrice: 1799,
      image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
      category: 'Warm Amber',
      volume: '100 ml',
      topNotes: 'Cardamom, Blood Orange, Cinnamon',
      heartNotes: 'Rich Amber Resin, Labdanum, Cocoa Blossom',
      baseNotes: 'Bourbon Vanilla, Sandalwood, Tonka Bean',
      featured: false
    }
  ];

  // Helper map for instant O(1) product lookups
  const PRODUCTS_MAP = {};
  PRODUCTS.forEach(p => {
    PRODUCTS_MAP[p.id] = p;
  });

  // State Management: Unified Cart & Order
  // Starts with 1 Signature Eau de Parfum by default
  let cart = [
    { id: 'noire-signature', quantity: 1 }
  ];

  let isSubmitting = false;
  let lastOrderData = null;
  let activeModalProductId = null;
  let lastFocusedElement = null;

  // =========================================================================
  // 2. DOM ELEMENT SELECTIONS
  // =========================================================================

  // Header & Navigation
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link, .nav-cta');
  const navCartBtn = document.getElementById('navCartBtn');
  const navCartBadge = document.getElementById('navCartBadge');

  // Showcase Section Controls
  const showcaseQtyInput = document.querySelector('.product-showcase .qty-value') || document.querySelector('.qty-value');
  const showcaseMinusBtn = document.querySelector('.product-showcase .qty-minus') || document.querySelector('.qty-btn.qty-minus');
  const showcasePlusBtn = document.querySelector('.product-showcase .qty-plus') || document.querySelector('.qty-btn.qty-plus');
  const showcaseSubtotalDisplay = document.querySelector('.subtotal-value');
  const showcaseAddToOrderBtn = document.querySelector('.product-showcase .btn-add-to-order');
  const showcaseWhatsAppBtn = document.querySelector('.btn-whatsapp-order');

  // Related Products Catalog Grid
  const relatedProductsGrid = document.getElementById('relatedProductsGrid');

  // Product Details Modal
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');

  // Shopping Cart Drawer
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBody = document.getElementById('cartBody');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartDrawerSubtotal = document.getElementById('cartDrawerSubtotal');
  const btnCartCheckout = document.getElementById('btnCartCheckout');
  const btnCartWhatsApp = document.getElementById('btnCartWhatsApp');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // Order Section & Checkout Form
  const orderSection = document.getElementById('order');
  const orderForm = document.getElementById('orderForm');
  const orderFormWrapper = document.querySelector('.order-form-wrapper');
  const orderQuantityInput = document.getElementById('orderQuantity');
  const formCartCountBadge = document.getElementById('formCartCountBadge');
  const btnModifyCart = document.getElementById('btnModifyCart');
  const orderSummaryItems = document.getElementById('orderSummaryItems');
  const summaryEditBtn = document.getElementById('summaryEditBtn');
  const summaryTotalQty = document.getElementById('summaryTotalQty');
  const summaryTotalSubtotal = document.getElementById('summaryTotalSubtotal');
  const orderSuccess = document.getElementById('orderSuccess');
  const newOrderBtn = document.querySelector('.btn-new-order');
  const whatsappFormBtn = document.querySelector('.btn-whatsapp-form');
  const whatsappSuccessBtn = document.querySelector('.btn-whatsapp-success');
  const whatsappFloat = document.querySelector('.whatsapp-float');

  // FAQ & Animations & Footer
  const faqButtons = document.querySelectorAll('.faq-question');
  const animatedElements = document.querySelectorAll('[data-animate]');
  const currentYearEl = document.getElementById('currentYear');

  // =========================================================================
  // 3. HELPER FUNCTIONS
  // =========================================================================

  /**
   * Format number as Egyptian Pounds (e.g., EGP 1,499)
   * @param {number} amount
   * @returns {string}
   */
  function formatPrice(amount) {
    return `EGP ${amount.toLocaleString('en-US')}`;
  }

  /**
   * Clamp quantity between MIN_QUANTITY and MAX_QUANTITY
   * @param {string|number} value
   * @returns {number}
   */
  function sanitizeQuantity(value) {
    let parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < MIN_QUANTITY) {
      parsed = MIN_QUANTITY;
    } else if (parsed > MAX_QUANTITY) {
      parsed = MAX_QUANTITY;
    }
    return parsed;
  }

  /**
   * Smooth scroll to target element with offset for fixed header
   * @param {HTMLElement} element
   */
  function scrollToElementWithOffset(element) {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // =========================================================================
  // 4. TOAST NOTIFICATION SYSTEM
  // =========================================================================

  /**
   * Displays an elegant luxury toast notification
   * @param {string} message
   * @param {string|null} actionText
   * @param {Function|null} actionCallback
   * @param {number} duration
   */
  function showToast(message, actionText = null, actionCallback = null, duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');

    let toastHtml = `
      <div class="toast-content">
        <span class="toast-icon">✓</span>
        <span>${message}</span>
      </div>
    `;

    if (actionText) {
      toastHtml += `<button type="button" class="toast-action">${actionText}</button>`;
    }

    toast.innerHTML = toastHtml;

    if (actionText && actionCallback) {
      const actionBtn = toast.querySelector('.toast-action');
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          actionCallback();
          dismissToast(toast);
        });
      }
    }

    toastContainer.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const timer = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    function dismissToast(targetToast) {
      clearTimeout(timer);
      targetToast.classList.remove('show');
      setTimeout(() => {
        if (targetToast.parentNode) {
          targetToast.parentNode.removeChild(targetToast);
        }
      }, 350);
    }
  }

  // =========================================================================
  // 5. UNIFIED CART STATE & METHODS
  // =========================================================================

  /**
   * Calculates total items and subtotal of the cart
   * @returns {{ totalCount: number, subtotal: number }}
   */
  function getCartTotals() {
    let totalCount = 0;
    let subtotal = 0;

    cart.forEach(item => {
      const product = PRODUCTS_MAP[item.id];
      if (product) {
        totalCount += item.quantity;
        subtotal += product.price * item.quantity;
      }
    });

    return { totalCount, subtotal };
  }

  /**
   * Adds product to cart or increments existing quantity
   * @param {string} productId
   * @param {number} quantity
   * @param {boolean} showToastNotice
   */
  function addToCart(productId, quantity = 1, showToastNotice = true) {
    const product = PRODUCTS_MAP[productId];
    if (!product) return;

    const validatedQty = sanitizeQuantity(quantity);
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      const newTotal = cart[existingIndex].quantity + validatedQty;
      cart[existingIndex].quantity = Math.min(newTotal, MAX_QUANTITY);
    } else {
      cart.push({ id: productId, quantity: validatedQty });
    }

    // Sync showcase quantity if signature product was adjusted
    if (productId === 'noire-signature' && showcaseQtyInput) {
      const signatureItem = cart.find(i => i.id === 'noire-signature');
      if (signatureItem) {
        showcaseQtyInput.value = signatureItem.quantity;
        if (showcaseSubtotalDisplay) {
          showcaseSubtotalDisplay.textContent = formatPrice(signatureItem.quantity * product.price);
        }
      }
    }

    updateCartUI();

    if (showToastNotice) {
      showToast(
        `Added to order: ${product.name}`,
        'View Cart',
        () => openCartDrawer()
      );
    }
  }

  /**
   * Updates an item's quantity directly in the cart
   * @param {string} productId
   * @param {number} newQuantity
   */
  function updateCartItemQuantity(productId, newQuantity) {
    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex === -1) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    cart[existingIndex].quantity = sanitizeQuantity(newQuantity);

    // Sync showcase if signature product was modified
    if (productId === 'noire-signature' && showcaseQtyInput) {
      showcaseQtyInput.value = cart[existingIndex].quantity;
      const product = PRODUCTS_MAP[productId];
      if (product && showcaseSubtotalDisplay) {
        showcaseSubtotalDisplay.textContent = formatPrice(cart[existingIndex].quantity * product.price);
      }
    }

    updateCartUI();
  }

  /**
   * Removes an item from the cart
   * @param {string} productId
   */
  function removeFromCart(productId) {
    const product = PRODUCTS_MAP[productId];
    cart = cart.filter(item => item.id !== productId);

    // If signature product was removed, reset showcase qty display to 1
    if (productId === 'noire-signature' && showcaseQtyInput) {
      showcaseQtyInput.value = 1;
      const sigProduct = PRODUCTS_MAP['noire-signature'];
      if (sigProduct && showcaseSubtotalDisplay) {
        showcaseSubtotalDisplay.textContent = formatPrice(sigProduct.price);
      }
    }

    updateCartUI();

    if (product) {
      showToast(`Removed from order: ${product.name}`);
    }
  }

  /**
   * Central UI update that syncs navigation badge, cart drawer, and order summary
   */
  function updateCartUI() {
    const { totalCount, subtotal } = getCartTotals();

    // 1. Navigation Cart Badge
    if (navCartBadge) {
      navCartBadge.textContent = totalCount;
      navCartBadge.setAttribute('aria-label', `${totalCount} items in cart`);
      navCartBadge.classList.remove('pop');
      void navCartBadge.offsetWidth; // Force reflow
      navCartBadge.classList.add('pop');
    }

    // 2. Cart Drawer UI
    renderCartDrawer();

    // 3. Checkout Order Summary & Form Preview
    renderOrderSummary();

    // 4. Hidden Quantity input sync for validation compatibility
    if (orderQuantityInput) {
      orderQuantityInput.value = totalCount > 0 ? totalCount : 0;
    }

    // 5. Form preview badge
    if (formCartCountBadge) {
      formCartCountBadge.textContent = totalCount === 1
        ? '1 fragrance in order'
        : `${totalCount} fragrances in order`;
    }
  }

  /**
   * Renders the items list inside the shopping cart drawer
   */
  function renderCartDrawer() {
    if (!cartBody) return;

    const { totalCount, subtotal } = getCartTotals();

    if (cartDrawerCount) {
      cartDrawerCount.textContent = `(${totalCount})`;
    }

    if (cartDrawerSubtotal) {
      cartDrawerSubtotal.textContent = formatPrice(subtotal);
    }

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h4 class="cart-empty-title">Your Order is Empty</h4>
          <p class="cart-empty-desc">Explore our signature collection to add your favourite luxury fragrances.</p>
          <button type="button" class="btn btn-secondary btn-explore-collection" id="btnCartExplore">Explore Collection</button>
        </div>
      `;

      const exploreBtn = cartBody.querySelector('#btnCartExplore');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          closeCartDrawer();
          const target = document.getElementById('catalog') || document.getElementById('product');
          if (target) scrollToElementWithOffset(target);
        });
      }

      if (btnCartCheckout) btnCartCheckout.disabled = true;
      if (btnCartWhatsApp) btnCartWhatsApp.disabled = true;
      return;
    }

    if (btnCartCheckout) btnCartCheckout.disabled = false;
    if (btnCartWhatsApp) btnCartWhatsApp.disabled = false;

    let itemsHtml = '';
    cart.forEach(item => {
      const product = PRODUCTS_MAP[item.id];
      if (!product) return;

      const itemSubtotal = product.price * item.quantity;

      itemsHtml += `
        <div class="cart-item" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img" loading="lazy">
          <div class="cart-item-details">
            <h4 class="cart-item-name" title="${product.name}">${product.name}</h4>
            <div class="cart-item-price">${formatPrice(product.price)} · ${product.volume || '100 ml'}</div>
            <div class="cart-qty-row">
              <div class="cart-stepper">
                <button type="button" class="cart-step-btn cart-step-minus" data-id="${product.id}" aria-label="Decrease quantity for ${product.name}">−</button>
                <span class="cart-step-qty">${item.quantity}</span>
                <button type="button" class="cart-step-btn cart-step-plus" data-id="${product.id}" aria-label="Increase quantity for ${product.name}">+</button>
              </div>
              <span class="cart-item-subtotal">${formatPrice(itemSubtotal)}</span>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-id="${product.id}" aria-label="Remove ${product.name} from cart" title="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      `;
    });

    cartBody.innerHTML = itemsHtml;

    // Attach Stepper & Remove Handlers
    cartBody.querySelectorAll('.cart-step-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === pId);
        if (item) updateCartItemQuantity(pId, item.quantity - 1);
      });
    });

    cartBody.querySelectorAll('.cart-step-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === pId);
        if (item) updateCartItemQuantity(pId, item.quantity + 1);
      });
    });

    cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        removeFromCart(pId);
      });
    });
  }

  /**
   * Renders the dynamic order summary panel in the checkout section
   */
  function renderOrderSummary() {
    if (!orderSummaryItems) return;

    const { totalCount, subtotal } = getCartTotals();

    if (summaryTotalQty) {
      summaryTotalQty.textContent = totalCount === 1 ? '1 item' : `${totalCount} items`;
    }

    if (summaryTotalSubtotal) {
      summaryTotalSubtotal.textContent = formatPrice(subtotal);
    }

    if (cart.length === 0) {
      orderSummaryItems.innerHTML = `
        <div class="summary-empty-msg">
          <p>Your order is currently empty.</p>
          <a href="#catalog" class="btn btn-secondary" style="margin-top: 0.75rem; font-size: 0.8rem; padding: 0.5rem 1rem;">Select a Fragrance</a>
        </div>
      `;
      return;
    }

    let summaryHtml = '';
    cart.forEach(item => {
      const product = PRODUCTS_MAP[item.id];
      if (!product) return;

      const itemSubtotal = product.price * item.quantity;

      summaryHtml += `
        <div class="summary-product-row">
          <div class="summary-product-info">
            <span class="summary-product-name">${product.name}</span>
            <span class="summary-product-calc">${item.quantity} × ${formatPrice(product.price)}</span>
          </div>
          <span class="summary-product-subtotal">${formatPrice(itemSubtotal)}</span>
        </div>
      `;
    });

    orderSummaryItems.innerHTML = summaryHtml;
  }

  /**
   * Opens the slide-out cart drawer
   */
  function openCartDrawer() {
    if (!cartDrawer || !cartBackdrop) return;
    lastFocusedElement = document.activeElement;
    cartBackdrop.removeAttribute('hidden');
    cartBackdrop.classList.add('open');
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (cartCloseBtn) cartCloseBtn.focus();
  }

  /**
   * Closes the slide-out cart drawer
   */
  function closeCartDrawer() {
    if (!cartDrawer || !cartBackdrop) return;
    cartBackdrop.classList.remove('open');
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      cartBackdrop.setAttribute('hidden', '');
    }, 300);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // =========================================================================
  // 6. DYNAMIC RELATED PRODUCTS CATALOG GRID
  // =========================================================================

  /**
   * Renders product cards into #relatedProductsGrid from PRODUCTS array
   */
  function renderRelatedProductsGrid() {
    if (!relatedProductsGrid) return;

    // Filter catalog products (can display all non-featured, or the full related portfolio)
    const catalogProducts = PRODUCTS.filter(p => !p.featured);

    let gridHtml = '';
    catalogProducts.forEach(product => {
      const oldPriceHtml = product.oldPrice
        ? `<span class="card-price-old">${formatPrice(product.oldPrice)} <span class="card-old-tag">(Promo)</span></span>`
        : '';

      gridHtml += `
        <article class="product-card" data-animate data-id="${product.id}">
          <div class="card-image-wrapper">
            <img src="${product.image}" alt="${product.name} luxury bottle" class="card-image" loading="lazy">
            <span class="card-badge-category">${product.category}</span>
            <span class="card-badge-demo">Demo</span>
          </div>
          <div class="card-info">
            <h3 class="card-title">${product.name}</h3>
            <p class="card-desc">${product.description}</p>
            <div class="card-pricing">
              <span class="card-price-current">${formatPrice(product.price)}</span>
              ${oldPriceHtml}
            </div>
            <div class="card-actions">
              <button type="button" class="btn btn-card-details" data-id="${product.id}" aria-label="View details for ${product.name}">
                View Details
              </button>
              <button type="button" class="btn btn-card-add" data-id="${product.id}" aria-label="Add ${product.name} to order">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add to Order
              </button>
            </div>
          </div>
        </article>
      `;
    });

    relatedProductsGrid.innerHTML = gridHtml;

    // Attach Event Listeners to Catalog Buttons
    relatedProductsGrid.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        openProductModal(pId);
      });
    });

    relatedProductsGrid.querySelectorAll('.btn-card-add').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        addToCart(pId, 1, true);
      });
    });
  }

  // =========================================================================
  // 7. PRODUCT DETAILS MODAL
  // =========================================================================

  /**
   * Opens the product details modal with complete olfactory notes
   * @param {string} productId
   */
  function openProductModal(productId) {
    const product = PRODUCTS_MAP[productId];
    if (!product || !productModal || !modalContent) return;

    activeModalProductId = productId;
    lastFocusedElement = document.activeElement;

    const oldPriceHtml = product.oldPrice
      ? `<span class="modal-price-old">${formatPrice(product.oldPrice)}</span>`
      : '';

    modalContent.innerHTML = `
      <div class="modal-grid">
        <div class="modal-image-col">
          <img src="${product.image}" alt="${product.name} - Luxury bottle presentation" class="modal-img">
        </div>
        <div class="modal-info-col">
          <span class="modal-badge">${product.category}</span>
          <h3 class="modal-title" id="modalProductName">${product.name}</h3>
          <p class="modal-volume">${product.volume || '100 ml'} Eau de Parfum</p>
          <div class="modal-price-row">
            <span class="modal-price-current">${formatPrice(product.price)}</span>
            ${oldPriceHtml}
          </div>
          <p class="modal-desc">${product.description}</p>

          <div class="modal-notes-section">
            <h4 class="modal-notes-title">Olfactory Pyramid</h4>
            <div class="modal-note-item"><strong>Top Notes:</strong> ${product.topNotes || 'Citrus Essences'}</div>
            <div class="modal-note-item"><strong>Heart Notes:</strong> ${product.heartNotes || 'Floral Harmony'}</div>
            <div class="modal-note-item"><strong>Base Notes:</strong> ${product.baseNotes || 'Precious Woods & Amber'}</div>
          </div>

          <div class="modal-actions-row">
            <div class="modal-qty-stepper">
              <button type="button" class="modal-qty-btn modal-minus-btn" aria-label="Decrease quantity">−</button>
              <span class="modal-qty-value" id="modalQtyDisplay">1</span>
              <button type="button" class="modal-qty-btn modal-plus-btn" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn btn-primary btn-modal-add" id="btnModalAdd">
              Add to Order
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal Quantity Controls
    let modalQuantity = 1;
    const modalQtyDisplay = modalContent.querySelector('#modalQtyDisplay');
    const modalMinusBtn = modalContent.querySelector('.modal-minus-btn');
    const modalPlusBtn = modalContent.querySelector('.modal-plus-btn');
    const modalAddBtn = modalContent.querySelector('#btnModalAdd');

    if (modalMinusBtn && modalQtyDisplay) {
      modalMinusBtn.addEventListener('click', () => {
        if (modalQuantity > MIN_QUANTITY) {
          modalQuantity--;
          modalQtyDisplay.textContent = modalQuantity;
        }
      });
    }

    if (modalPlusBtn && modalQtyDisplay) {
      modalPlusBtn.addEventListener('click', () => {
        if (modalQuantity < MAX_QUANTITY) {
          modalQuantity++;
          modalQtyDisplay.textContent = modalQuantity;
        }
      });
    }

    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        addToCart(product.id, modalQuantity, true);
        closeProductModal();
      });
    }

    productModal.removeAttribute('hidden');
    productModal.classList.add('open');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalCloseBtn) modalCloseBtn.focus();
  }

  /**
   * Closes the product details modal
   */
  function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('open');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      productModal.setAttribute('hidden', '');
      activeModalProductId = null;
    }, 300);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  // =========================================================================
  // 8. MOBILE NAVIGATION TOGGLE
  // =========================================================================

  if (navToggle && navLinks) {
    const toggleMenu = (shouldOpen) => {
      const isOpen = typeof shouldOpen === 'boolean'
        ? shouldOpen
        : !navLinks.classList.contains('active');

      navToggle.classList.toggle('active', isOpen);
      navLinks.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navItems.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active')) {
        const isClickInside = navLinks.contains(e.target) || navToggle.contains(e.target);
        if (!isClickInside) {
          toggleMenu(false);
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  // =========================================================================
  // 9. STICKY HEADER ON SCROLL
  // =========================================================================

  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // =========================================================================
  // 10. SMOOTH SCROLL FOR ANCHOR LINKS
  // =========================================================================

  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        scrollToElementWithOffset(targetElement);
      }
    });
  });

  // =========================================================================
  // 11. PRODUCT SHOWCASE CONTROLS (SIGNATURE PERFUME)
  // =========================================================================

  const signatureProduct = PRODUCTS_MAP['noire-signature'];
  const sigPrice = signatureProduct ? signatureProduct.price : 1499;

  // Showcase Minus Button
  if (showcaseMinusBtn && showcaseQtyInput) {
    showcaseMinusBtn.addEventListener('click', () => {
      const currentVal = parseInt(showcaseQtyInput.value, 10) || 1;
      if (currentVal > MIN_QUANTITY) {
        showcaseQtyInput.value = currentVal - 1;
        if (showcaseSubtotalDisplay) {
          showcaseSubtotalDisplay.textContent = formatPrice((currentVal - 1) * sigPrice);
        }
      }
    });
  }

  // Showcase Plus Button
  if (showcasePlusBtn && showcaseQtyInput) {
    showcasePlusBtn.addEventListener('click', () => {
      const currentVal = parseInt(showcaseQtyInput.value, 10) || 1;
      if (currentVal < MAX_QUANTITY) {
        showcaseQtyInput.value = currentVal + 1;
        if (showcaseSubtotalDisplay) {
          showcaseSubtotalDisplay.textContent = formatPrice((currentVal + 1) * sigPrice);
        }
      }
    });
  }

  // Showcase Add to Order Button: Adds Signature Perfume with selected quantity
  if (showcaseAddToOrderBtn) {
    showcaseAddToOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const qty = showcaseQtyInput ? sanitizeQuantity(showcaseQtyInput.value) : 1;
      addToCart('noire-signature', qty, true);

      // Smooth scroll to order section
      if (orderSection) {
        scrollToElementWithOffset(orderSection);
      }
    });
  }

  // Hero "Order Now" Button handler
  const heroOrderBtn = document.querySelector('.hero-actions .btn-primary');
  if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', (e) => {
      // Ensure at least 1 Signature perfume is in cart
      if (!cart.some(item => item.id === 'noire-signature')) {
        addToCart('noire-signature', 1, false);
      }
    });
  }

  // =========================================================================
  // 12. CHECKOUT ORDER FORM VALIDATION
  // =========================================================================

  function setFieldError(input, message) {
    if (!input) return;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    const formGroup = input.closest('.form-group') || input.parentElement;
    if (formGroup) {
      const errorSpan = formGroup.querySelector('.form-error');
      if (errorSpan) {
        errorSpan.textContent = message;
      }
    }
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    const formGroup = input.closest('.form-group') || input.parentElement;
    if (formGroup) {
      const errorSpan = formGroup.querySelector('.form-error');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    }
  }

  function clearAllErrors(form) {
    if (!form) return;
    form.querySelectorAll('.form-input').forEach(input => {
      clearFieldError(input);
    });
  }

  /**
   * Validates form fields and cart contents
   * @param {HTMLFormElement} form
   * @returns {{ isValid: boolean, firstInvalid: HTMLElement|null, formData: Object|null }}
   */
  function validateForm(form) {
    if (!form) return { isValid: false, firstInvalid: null, formData: null };

    let isValid = true;
    let firstInvalid = null;

    const fullNameInput = form.querySelector('input[name="fullName"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const cityInput = form.querySelector('select[name="city"]');
    const addressInput = form.querySelector('input[name="address"]');
    const notesInput = form.querySelector('textarea[name="notes"]');

    // 0. Cart Validation: Cart must not be empty
    if (cart.length === 0) {
      isValid = false;
      showToast('Please add at least one fragrance to your order before checkout.');
      openCartDrawer();
      return { isValid: false, firstInvalid: null, formData: null };
    }

    // 1. Full Name Validation
    if (fullNameInput) {
      const fullNameVal = fullNameInput.value.trim();
      if (!fullNameVal) {
        isValid = false;
        setFieldError(fullNameInput, 'Please enter your full name.');
        if (!firstInvalid) firstInvalid = fullNameInput;
      } else {
        clearFieldError(fullNameInput);
      }
    }

    // 2. Phone Number Validation (Egyptian mobile: 01XXXXXXXXX)
    if (phoneInput) {
      const phoneVal = phoneInput.value.trim();
      const egyptianPhoneRegex = /^01[0-9]{9}$/;
      if (!phoneVal || !egyptianPhoneRegex.test(phoneVal)) {
        isValid = false;
        setFieldError(phoneInput, 'Please enter a valid Egyptian mobile number (01XXXXXXXXX).');
        if (!firstInvalid) firstInvalid = phoneInput;
      } else {
        clearFieldError(phoneInput);
      }
    }

    // 3. City / Governorate Validation
    if (cityInput) {
      const cityVal = cityInput.value.trim();
      if (!cityVal) {
        isValid = false;
        setFieldError(cityInput, 'Please select your city or governorate.');
        if (!firstInvalid) firstInvalid = cityInput;
      } else {
        clearFieldError(cityInput);
      }
    }

    // 4. Delivery Address Validation (at least 10 characters)
    if (addressInput) {
      const addressVal = addressInput.value.trim();
      if (!addressVal || addressVal.length < 10) {
        isValid = false;
        setFieldError(addressInput, 'Please enter your full delivery address (at least 10 characters).');
        if (!firstInvalid) firstInvalid = addressInput;
      } else {
        clearFieldError(addressInput);
      }
    }

    const formData = {
      fullName: fullNameInput ? fullNameInput.value.trim() : '',
      phone: phoneInput ? phoneInput.value.trim() : '',
      city: cityInput ? cityInput.value.trim() : '',
      address: addressInput ? addressInput.value.trim() : '',
      notes: notesInput ? notesInput.value.trim() : ''
    };

    return { isValid, firstInvalid, formData };
  }

  // Real-time error clearing on inputs
  if (orderForm) {
    orderForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) clearFieldError(input);
      });
      input.addEventListener('change', () => {
        if (input.classList.contains('error')) clearFieldError(input);
      });
    });
  }

  // =========================================================================
  // 13. ORDER FORM SUBMISSION
  // =========================================================================

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isSubmitting) return;

      const { isValid, firstInvalid, formData } = validateForm(orderForm);

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      const submitBtn = orderForm.querySelector('.btn-submit-order');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Order...';
      }

      lastOrderData = formData;

      // Simulate preparation delay (800ms)
      setTimeout(() => {
        if (orderFormWrapper) {
          orderFormWrapper.setAttribute('hidden', '');
          orderFormWrapper.style.display = 'none';
        }

        if (orderSuccess) {
          orderSuccess.removeAttribute('hidden');
          orderSuccess.style.display = 'block';
          orderSuccess.scrollIntoView({ behavior: 'smooth' });
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }

        isSubmitting = false;
      }, 800);
    });
  }

  // New Order / Reset Button handler
  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      isSubmitting = false;
      lastOrderData = null;

      if (orderSuccess) {
        orderSuccess.setAttribute('hidden', '');
        orderSuccess.style.display = 'none';
      }

      if (orderFormWrapper) {
        orderFormWrapper.removeAttribute('hidden');
        orderFormWrapper.style.display = '';
      }

      if (orderForm) {
        orderForm.reset();
        clearAllErrors(orderForm);
      }

      // Restore 1 default signature perfume
      cart = [{ id: 'noire-signature', quantity: 1 }];
      updateCartUI();

      if (orderFormWrapper) {
        scrollToElementWithOffset(orderFormWrapper);
      }
    });
  }

  // =========================================================================
  // 14. MULTI-PRODUCT WHATSAPP ORDER GENERATION
  // =========================================================================

  /**
   * Generates a comprehensive WhatsApp order message with every selected product,
   * quantity, unit price, item subtotal, total subtotal, and customer details.
   * @param {Object|null} customerData
   * @returns {string}
   */
  function generateWhatsAppMessage(customerData = null) {
    const { totalCount, subtotal } = getCartTotals();

    let message = `Hello NOIRÉ! I would like to place an order:\n\n`;
    message += `══════ ORDER SUMMARY ══════\n`;

    if (cart.length === 0) {
      message += `1. NOIRÉ Signature Eau de Parfum (100ml)\n`;
      message += `   Quantity: 1 × ${formatPrice(1499)} = ${formatPrice(1499)}\n`;
      message += `────────────────────────────\n`;
      message += `Total Fragrances: 1\n`;
      message += `Subtotal: ${formatPrice(1499)}\n`;
    } else {
      cart.forEach((item, index) => {
        const product = PRODUCTS_MAP[item.id];
        if (!product) return;
        const itemSubtotal = product.price * item.quantity;
        message += `${index + 1}. ${product.name} (${product.volume || '100ml'})\n`;
        message += `   Qty: ${item.quantity} × ${formatPrice(product.price)} = ${formatPrice(itemSubtotal)}\n`;
      });

      message += `────────────────────────────\n`;
      message += `Total Fragrances: ${totalCount}\n`;
      message += `Total Order Subtotal: ${formatPrice(subtotal)}\n`;
    }

    message += `* Delivery fees calculated separately upon confirmation.\n`;

    if (customerData && customerData.fullName) {
      message += `\n══════ DELIVERY DETAILS ══════\n`;
      message += `Client Name: ${customerData.fullName}\n`;
      message += `Mobile Phone: ${customerData.phone}\n`;
      message += `City / Governorate: ${customerData.city}\n`;
      message += `Delivery Address: ${customerData.address}\n`;
      if (customerData.notes) {
        message += `Special Notes: ${customerData.notes}\n`;
      }
    }

    message += `\nPlease confirm product availability and dispatch timing. Thank you!`;
    return message;
  }

  /**
   * Opens WhatsApp with the fully encoded order message
   * @param {Object|null} customerData
   */
  function openWhatsApp(customerData = null) {
    const message = generateWhatsAppMessage(customerData);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Showcase WhatsApp Button
  if (showcaseWhatsAppBtn) {
    showcaseWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Ensure Signature is in cart if cart was empty
      if (!cart.some(i => i.id === 'noire-signature')) {
        addToCart('noire-signature', 1, false);
      }
      openWhatsApp(null);
    });
  }

  // Cart Drawer WhatsApp Button
  if (btnCartWhatsApp) {
    btnCartWhatsApp.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        showToast('Please add a fragrance to your order first.');
        return;
      }
      openWhatsApp(lastOrderData);
    });
  }

  // Cart Drawer Proceed to Checkout Button
  if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', (e) => {
      e.preventDefault();
      closeCartDrawer();
      if (orderSection) {
        scrollToElementWithOffset(orderSection);
      }
    });
  }

  // Form Complete via WhatsApp Button
  if (whatsappFormBtn) {
    whatsappFormBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (cart.length === 0) {
        showToast('Please add at least one fragrance to your order before checkout.');
        openCartDrawer();
        return;
      }

      const { isValid, firstInvalid, formData } = validateForm(orderForm);
      if (isValid) {
        openWhatsApp(formData);
      } else {
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  // Success Screen WhatsApp Button
  if (whatsappSuccessBtn) {
    whatsappSuccessBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(lastOrderData);
    });
  }

  // Floating WhatsApp Button
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(lastOrderData);
    });
  }

  // =========================================================================
  // 15. CART & MODAL TRIGGERS
  // =========================================================================

  // Nav Cart Button click
  if (navCartBtn) {
    navCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Cart Drawer Close Button
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCartDrawer();
    });
  }

  // Cart Drawer Backdrop click
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) {
        closeCartDrawer();
      }
    });
  }

  // Modal Close Button
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeProductModal();
    });
  }

  // Modal Backdrop click
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // Modify Cart Button inside Checkout Form
  if (btnModifyCart) {
    btnModifyCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Edit Cart Button inside Order Summary Panel
  if (summaryEditBtn) {
    summaryEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Keyboard Navigation: Escape key closes modal & cart drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (productModal && productModal.classList.contains('open')) {
        closeProductModal();
      }
      if (cartDrawer && cartDrawer.classList.contains('open')) {
        closeCartDrawer();
      }
    }
  });

  // =========================================================================
  // 16. FAQ ACCORDION
  // =========================================================================

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;

      const answer = item.querySelector('.faq-answer');
      if (!answer) return;

      const isOpen = item.classList.contains('active');

      // Close all other active FAQ items
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          const activeBtn = activeItem.querySelector('.faq-question');
          const activeAns = activeItem.querySelector('.faq-answer');
          if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
          if (activeAns) activeAns.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // =========================================================================
  // 17. SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
  // =========================================================================

  function initScrollAnimations() {
    const animElements = document.querySelectorAll('[data-animate]');
    if (animElements.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      animElements.forEach(el => el.classList.add('visible'));
      return;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      animElements.forEach(el => observer.observe(el));
    } else {
      animElements.forEach(el => el.classList.add('visible'));
    }
  }

  // =========================================================================
  // 18. DYNAMIC COPYRIGHT YEAR
  // =========================================================================

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 19. INITIALIZATION
  // =========================================================================

  // Render related products grid dynamically
  renderRelatedProductsGrid();

  // Initialize unified cart UI & summaries
  updateCartUI();

  // Initialize scroll animations
  initScrollAnimations();
});
