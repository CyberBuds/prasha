'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import TrustBar from '@/components/TrustBar';
import CategoryGrid from '@/components/CategoryGrid';
import ProductGrid from '@/components/ProductGrid';
import FilterDrawer from '@/components/FilterDrawer';
import ProductDetailPage from '@/components/ProductDetailPage';
import RealReelsSection from '@/components/RealReelsSection';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderTrackingModal from '@/components/OrderTrackingModal';
import WishlistDrawer from '@/components/WishlistDrawer';
import AiStylistModal from '@/components/AiStylistModal';
import AuthModal from '@/components/AuthModal';
import WeaverStorySection from '@/components/WeaverStorySection';
import Footer from '@/components/Footer';

import { Saree, CartItem, FilterState, BlouseCustomization, OrderDetails, UserProfile } from '@/types';
import { CatalogCategory, fetchCatalog } from '@/lib/catalog';
import { authenticatedFetch, clearSession, getValidatedSession, SESSION_EXPIRED_EVENT } from '@/lib/session';

function toUserProfile(customer: any): UserProfile {
  return {
    id: `usr_${customer.id}`,
    name: [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email || 'Silk Patron',
    email: customer.email || '',
    phone: customer.mobile || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    joinedDate: 'Logged in via API',
    tier: 'Silver Patron'
  };
}

export default function Home() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [pendingCartItemIndex, setPendingCartItemIndex] = useState<number | null>(null);
  const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>([]);
  const [cartSessionId, setCartSessionId] = useState<string | null>(null);
  const [remoteCartItemIds, setRemoteCartItemIds] = useState<Record<string, number>>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [checkoutLoginPending, setCheckoutLoginPending] = useState(false);
  const [checkoutLoginPrompt, setCheckoutLoginPrompt] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState<string>('All Heritage Weaves');

  useEffect(() => {
    let isMounted = true;

    // Stored user data is display cache only. Authentication is restored only
    // after the protected API confirms the current access token.
    void getValidatedSession<any>().then((customer) => {
      if (!isMounted || !customer) return;
      const user = toUserProfile(customer);
      setCurrentUser(user);
      window.localStorage.setItem('prasha-user', JSON.stringify(user));
    });

    const existingSessionId = window.localStorage.getItem('prasha-cart-session');
    const sessionId = existingSessionId || crypto.randomUUID();
    window.localStorage.setItem('prasha-cart-session', sessionId);
    setCartSessionId(sessionId);

    fetchCatalog()
      .then(({ products, categories }) => {
        if (!isMounted) return;
        if (products.length > 0) setSarees(products);
        if (categories.length > 0) setCatalogCategories(categories);
      })
      .catch(() => {
        // The local catalogue remains available when the API is unavailable.
      })
      .finally(() => {
        if (isMounted) setIsCatalogLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleExpiredSession = () => {
      setCurrentUser(null);
      setPlacedOrders([]);
      setIsCheckoutOpen(false);
      setCheckoutLoginPending(true);
      setCheckoutLoginPrompt('Your session has expired. Please log in again to continue.');
      setIsAuthOpen(true);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpiredSession);
  }, []);

  useEffect(() => {
    // Reconfirm the server-side session while the storefront is open. This is
    // intentionally a protected API check rather than a local token/user test.
    const validateOnFocus = () => void getValidatedSession();
    const interval = window.setInterval(validateOnFocus, 60_000);
    window.addEventListener('focus', validateOnFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', validateOnFocus);
    };
  }, []);

  // Full Page Product Detail view state
  const [selectedSareeForPage, setSelectedSareeForPage] = useState<Saree | null>(null);

  useEffect(() => {
    const syncProductFromUrl = () => {
      const productId = new URLSearchParams(window.location.search).get('product');
      const product = productId ? sarees.find((item) => item.id === productId) : null;
      setSelectedSareeForPage(product || null);
    };

    syncProductFromUrl();
    window.addEventListener('popstate', syncProductFromUrl);
    return () => window.removeEventListener('popstate', syncProductFromUrl);
  }, [sarees]);

  const [filterState, setFilterState] = useState<FilterState>({
    crafts: [],
    fabrics: [],
    occasions: [],
    colors: [],
    maxPrice: 100000,
    minPrice: 0,
    onlyBestsellers: false,
    onlyInStock: true,
    searchQuery: '',
    sortBy: 'featured'
  });

  // Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutGiftWrap, setCheckoutGiftWrap] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<OrderDetails[]>([]);
  const [selectedTrackedOrder, setSelectedTrackedOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setPlacedOrders([]);
      return;
    }

    void authenticatedFetch('/api/storefront/orders')
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.message || 'Unable to load orders');
        return payload.data || [];
      })
      .then((orders) => {
        setPlacedOrders(orders.map((order: any): OrderDetails => ({
          orderId: order.orderNumber,
          customerName: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone,
          address: order.shippingAddress?.addressLine1 || currentUser.address,
          city: order.shippingAddress?.city || currentUser.city,
          state: order.shippingAddress?.state || currentUser.state,
          pincode: order.shippingAddress?.pincode || currentUser.pincode,
          items: [],
          subtotal: Number(order.subtotal || 0),
          discountAmount: Number(order.discountAmount || 0) + Number(order.couponDiscount || 0),
          shippingFee: Number(order.shippingCharge || 0),
          totalAmount: Number(order.grandTotal || 0),
          paymentMethod: 'COD',
          status: order.orderStatus === 'DELIVERED' ? 'Delivered' : order.orderStatus === 'SHIPPED' ? 'Handloom Dispatched' : 'Order Placed',
          createdAt: new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN'),
          estimatedDelivery: 'To be confirmed'
        })));
      })
      .catch(() => setPlacedOrders([]));
  }, [currentUser]);

  const requireActiveSession = async (prompt: string) => {
    const customer = await getValidatedSession<any>();
    if (!customer) {
      setCheckoutLoginPending(true);
      setCheckoutLoginPrompt(prompt);
      setIsAuthOpen(true);
      return false;
    }
    const user = toUserProfile(customer);
    setCurrentUser(user);
    window.localStorage.setItem('prasha-user', JSON.stringify(user));
    return true;
  };

  const handleOpenProductDetail = (saree: Saree) => {
    setSelectedSareeForPage(saree);
    window.history.pushState({}, '', `/?product=${encodeURIComponent(saree.id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseProductDetail = () => {
    window.history.replaceState({}, '', '/');
    setSelectedSareeForPage(null);
  };

  // Category Selection Handler
  const handleSelectCategory = (cat?: string) => {
    handleCloseProductDetail();
    if (!cat || cat === 'ALL') {
      setFilterState(prev => ({ ...prev, crafts: [], occasions: [], searchQuery: '', onlyBestsellers: false }));
      setSelectedCategoryTitle('All Heritage Weaves');
    } else if (cat === 'BESTSELLERS') {
      setFilterState(prev => ({ ...prev, crafts: [], occasions: [], searchQuery: '', onlyBestsellers: true }));
      setSelectedCategoryTitle('Bestselling Handloom Sarees');
    } else if (cat.startsWith('OCCASION:')) {
      const occName = cat.replace('OCCASION:', '');
      setFilterState(prev => ({ ...prev, crafts: [], occasions: [occName as any], searchQuery: '', onlyBestsellers: false }));
      setSelectedCategoryTitle(`Curated for ${occName}`);
    } else if (cat === 'WEAVER_STORIES') {
      const el = document.getElementById('weaver-heritage');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    } else {
      setFilterState(prev => ({ ...prev, crafts: [cat as any], occasions: [], searchQuery: '', onlyBestsellers: false }));
      setSelectedCategoryTitle(`${cat} Collection`);
    }

    setTimeout(() => {
      const catEl = document.getElementById('catalogue-section');
      if (catEl) {
        catEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearchQuery = (query: string) => {
    setFilterState(prev => ({ ...prev, searchQuery: query }));
    setSelectedCategoryTitle(`Search Results for "${query}"`);
    const catEl = document.getElementById('catalogue-section');
    if (catEl) {
      catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart Actions
  const handleAddToCart = (saree: Saree, fallAndPicot: boolean = true, blouseOptions?: BlouseCustomization, keepExistingQuantity = false) => {
    const productId = Number(saree.id);
    const alreadyInCart = cartItems.some((item) => item.saree.id === saree.id);
    setAddingToCartId(saree.id);
    if (cartSessionId && Number.isInteger(productId) && productId > 0 && !(keepExistingQuantity && alreadyInCart)) {
      void fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1, sessionId: cartSessionId })
      }).then(async (response) => {
        if (!response.ok) return;
        const payload = await response.json();
        const remoteItem = payload.data?.items?.find((item: { productId?: number }) => item.productId === productId);
        if (remoteItem?.id) {
          setRemoteCartItemIds((current) => ({ ...current, [saree.id]: remoteItem.id }));
        }
      }).catch(() => {
        // Keep the local bag usable if the remote cart is unavailable.
      }).finally(() => {
        setAddingToCartId(null);
      });
    } else {
      setAddingToCartId(null);
    }

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.saree.id === saree.id);
      if (existingIdx > -1) {
        if (keepExistingQuantity) return prev;
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          saree,
          quantity: 1,
          fallAndPicot,
          blouseCustomization: blouseOptions || { stitchType: 'unstitched' }
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleCheckoutRequest = async (discount = checkoutDiscount, giftWrap = checkoutGiftWrap) => {
    setCheckoutDiscount(discount);
    setCheckoutGiftWrap(giftWrap);
    setIsCartOpen(false);

    if (!await requireActiveSession('Please log in to your account to proceed with checkout.')) {
      setCheckoutLoginPending(true);
      setCheckoutLoginPrompt('Please log in to your account to proceed with checkout.');
      setIsCheckoutOpen(false);
      setIsAuthOpen(true);
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleBuyNow = async (saree: Saree, fallAndPicot: boolean = true, blouseOptions?: BlouseCustomization) => {
    if (!await requireActiveSession('Please log in to buy this item.')) return;
    handleAddToCart(saree, fallAndPicot, blouseOptions, true);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
    await handleCheckoutRequest();
  };

  const handleUpdateCartQty = (index: number, newQty: number) => {
    if (pendingCartItemIndex === index) return;
    setPendingCartItemIndex(index);
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });

    const cartItem = cartItems[index];
    const remoteItemId = cartItem ? remoteCartItemIds[cartItem.saree.id] : undefined;
    if (remoteItemId) {
      void fetch(`/api/cart/items/${remoteItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      }).catch(() => undefined).finally(() => setPendingCartItemIndex(null));
    } else {
      setPendingCartItemIndex(null);
    }
  };

  const handleRemoveCartItem = (index: number) => {
    if (pendingCartItemIndex !== null && pendingCartItemIndex !== index) return;
    setPendingCartItemIndex(index);
    const cartItem = cartItems[index];
    const remoteItemId = cartItem ? remoteCartItemIds[cartItem.saree.id] : undefined;
    if (remoteItemId) {
      void fetch(`/api/cart/items/${remoteItemId}`, { method: 'DELETE' }).catch(() => undefined).finally(() => setPendingCartItemIndex(null));
      setRemoteCartItemIds((current) => {
        const next = { ...current };
        delete next[cartItem.saree.id];
        return next;
      });
    }
    setCartItems(prev => prev.filter((_, i) => i !== index));
    if (!remoteItemId) setPendingCartItemIndex(null);
  };

  const handleToggleFallPicot = (index: number) => {
    setCartItems(prev => {
      const updated = [...prev];
      updated[index].fallAndPicot = !updated[index].fallAndPicot;
      return updated;
    });
  };

  // Wishlist Actions
  const handleToggleWishlist = async (sareeId: string) => {
    if (!await requireActiveSession('Please log in to manage your wishlist.')) return;
    setWishlistIds(prev =>
      prev.includes(sareeId) ? prev.filter(id => id !== sareeId) : [...prev, sareeId]
    );
  };

  const handleOpenAccount = async () => {
    if (window.localStorage.getItem('prasha-auth-token')) {
      if (!await requireActiveSession('Your session has expired. Please log in again.')) return;
    }
    setIsAuthOpen(true);
  };

  // Filtering Logic
  const filteredSarees = useMemo(() => {
    return sarees.filter(saree => {
      // Craft filter
      if (filterState.crafts.length > 0 && !filterState.crafts.includes(saree.craft)) {
        return false;
      }
      // Occasion filter
      if (filterState.occasions.length > 0 && !filterState.occasions.includes(saree.occasion)) {
        return false;
      }
      // Bestseller filter
      if (filterState.onlyBestsellers && !saree.isBestseller) {
        return false;
      }
      // Search query
      if (filterState.searchQuery) {
        const q = filterState.searchQuery.toLowerCase();
        const match =
          saree.title.toLowerCase().includes(q) ||
          saree.craft.toLowerCase().includes(q) ||
          saree.fabric.toLowerCase().includes(q) ||
          saree.color.toLowerCase().includes(q) ||
          saree.occasion.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price_low') return a.price - b.price;
      if (filterState.sortBy === 'price_high') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // Default featured
    });
  }, [sarees, filterState]);

  const wishlistSarees = useMemo(() => {
    return sarees.filter(s => wishlistIds.includes(s.id));
  }, [sarees, wishlistIds]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
        onOpenTrackOrder={() => {
          setSelectedTrackedOrder(null);
          setIsTrackOrderOpen(true);
        }}
        onOpenAuth={handleOpenAccount}
        onSelectCategory={handleSelectCategory}
        onSearchQuery={handleSearchQuery}
        selectedCurrency={selectedCurrency}
        onChangeCurrency={setSelectedCurrency}
        allSarees={sarees}
        onSelectSaree={handleOpenProductDetail}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {selectedSareeForPage ? (
          /* Full Page Product Detail View */
          <ProductDetailPage
            saree={selectedSareeForPage}
            selectedCurrency={selectedCurrency}
            isWishlisted={wishlistIds.includes(selectedSareeForPage.id)}
            isAddingToCart={addingToCartId === selectedSareeForPage.id}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={handleCloseProductDetail}
            allSarees={sarees}
            onSelectSaree={handleOpenProductDetail}
            onOpenAiStylistWithPrompt={(prompt) => {
              setIsAiStylistOpen(true);
            }}
          />
        ) : (
          /* Main Homepage Sections */
          <>
            {/* Hero Banner Carousel */}
            <HeroCarousel
              onExplore={handleSelectCategory}
              onOpenAiStylist={() => setIsAiStylistOpen(true)}
            />

            {/* Trust & Craft Value Pillars */}
            <TrustBar />

            {/* Category & Occasion Discovery */}
            <CategoryGrid categories={catalogCategories} onSelectCategory={handleSelectCategory} />

            {/* Product Catalogue Grid */}
            <ProductGrid
              sarees={filteredSarees}
              isLoading={isCatalogLoading}
              addingToCartId={addingToCartId}
              selectedCurrency={selectedCurrency}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleOpenProductDetail}
              onAddToCart={(saree) => handleAddToCart(saree, true)}
              onOpenFilterDrawer={() => setIsFilterOpen(true)}
              filterState={filterState}
              onUpdateFilter={(newFilters) => setFilterState(prev => ({ ...prev, ...newFilters }))}
              onResetFilters={() =>
                setFilterState({
                  crafts: [],
                  fabrics: [],
                  occasions: [],
                  colors: [],
                  maxPrice: 100000,
                  minPrice: 0,
                  onlyBestsellers: false,
                  onlyInStock: true,
                  searchQuery: '',
                  sortBy: 'featured'
                })
              }
              currentCategoryTitle={selectedCategoryTitle}
            />

            {/* Real Reels & Drapes Section */}
            <RealReelsSection
              allSarees={sarees}
              onSelectSaree={handleOpenProductDetail}
            />

            {/* Weaver Heritage Story Section */}
            <WeaverStorySection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
      />

      {/* Modals & Drawers */}

      {/* 1. Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterState={filterState}
        onUpdateFilter={(newFilters) => setFilterState(prev => ({ ...prev, ...newFilters }))}
        onResetFilters={() =>
          setFilterState({
            crafts: [],
            fabrics: [],
            occasions: [],
            colors: [],
            maxPrice: 100000,
            minPrice: 0,
            onlyBestsellers: false,
            onlyInStock: true,
            searchQuery: '',
            sortBy: 'featured'
          })
        }
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onToggleFallPicot={handleToggleFallPicot}
        onOpenCheckout={(disc, gift) => {
          void handleCheckoutRequest(disc, gift);
        }}
        selectedCurrency={selectedCurrency}
        pendingItemIndex={pendingCartItemIndex}
      />

      {/* 4. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={checkoutDiscount}
        giftWrap={checkoutGiftWrap}
        selectedCurrency={selectedCurrency}
        cartSessionId={cartSessionId}
        currentUser={currentUser}
        onAuthenticationRequired={() => {
          setIsCheckoutOpen(false);
          setCheckoutLoginPending(true);
          setCheckoutLoginPrompt('Please log in to your account to proceed with checkout.');
          setIsAuthOpen(true);
        }}
        onOrderSuccess={(order) => {
          setPlacedOrders(prev => [order, ...prev]);
          setCartItems([]);
          const nextSessionId = crypto.randomUUID();
          window.localStorage.setItem('prasha-cart-session', nextSessionId);
          setCartSessionId(nextSessionId);
          setRemoteCartItemIds({});
        }}
      />

      {/* 5. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistSarees={wishlistSarees}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={(saree) => handleAddToCart(saree, true)}
        selectedCurrency={selectedCurrency}
      />

      {/* 6. AI Silk Stylist Modal */}
      <AiStylistModal
        isOpen={isAiStylistOpen}
        onClose={() => setIsAiStylistOpen(false)}
        allSarees={sarees}
        selectedCurrency={selectedCurrency}
        onSelectSaree={(saree) => {
          handleOpenProductDetail(saree);
          setIsAiStylistOpen(false);
        }}
      />

      {/* 7. User Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setCheckoutLoginPending(false);
          setCheckoutLoginPrompt('');
        }}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          window.localStorage.setItem('prasha-user', JSON.stringify(user));
          if (checkoutLoginPending) {
            setCheckoutLoginPending(false);
            setCheckoutLoginPrompt('');
            setIsAuthOpen(false);
            setIsCheckoutOpen(true);
          } else {
            setSelectedSareeForPage(null);
            setIsAuthOpen(false);
          }
        }}
        onLogout={() => {
          setCurrentUser(null);
          clearSession();
          setIsAuthOpen(false);
        }}
        onUpdateUser={(user) => {
          setCurrentUser(user);
          window.localStorage.setItem('prasha-user', JSON.stringify(user));
        }}
        ordersList={placedOrders}
        onOpenOrderTracking={(order) => {
          setIsAuthOpen(false);
          setSelectedTrackedOrder(order || null);
          setIsTrackOrderOpen(true);
        }}
        selectedCurrency={selectedCurrency}
        loginPrompt={checkoutLoginPrompt}
      />

      {/* 8. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        ordersList={placedOrders}
        selectedOrder={selectedTrackedOrder}
      />

      {/* Floating AI Stylist Chat Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={() => setIsAiStylistOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-[#1A1A1A]/90 hover:bg-[#1A1A1A] text-[#E6C268] text-xs font-bold px-3.5 py-2 rounded-full shadow-xl border border-[#E6C268]/40 backdrop-blur-md transition-all cursor-pointer hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E6C268]" />
          <span>AI Silk Stylist</span>
        </button>
        <button
          onClick={() => setIsAiStylistOpen(true)}
          className="relative p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-[#641F96] to-[#3B0B5C] text-[#E6C268] shadow-2xl border-2 border-[#E6C268] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group"
          aria-label="Open AI Silk Stylist Assistant"
          title="Prasha AI Silk Stylist Assistant"
        >
          <Sparkles className="w-6 h-6 text-[#E6C268] group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
        </button>
      </div>

    </div>
  );
}
