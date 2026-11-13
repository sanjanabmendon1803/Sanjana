import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Customer Facing Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SellerStorefrontPage } from './pages/SellerStorefrontPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Seller Portal Pages
import { SellerRegisterPage } from './pages/seller/SellerRegisterPage';
import { SellerLoginPage } from './pages/seller/SellerLoginPage';
import { SellerDashboardLayout } from './pages/seller/SellerDashboardLayout';
import { SellerOverviewPage } from './pages/seller/SellerOverviewPage';
import { SellerProductsPage } from './pages/seller/SellerProductsPage';
import { SellerAddProductPage } from './pages/seller/SellerAddProductPage';
import { SellerOrdersPage } from './pages/seller/SellerOrdersPage';
import { SellerDeliveryPage } from './pages/seller/SellerDeliveryPage';
import { SellerProfilePage } from './pages/seller/SellerProfilePage';
import { SellerPayoutsPage } from './pages/seller/SellerPayoutsPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const queryClient = new QueryClient();

// Main Customer Layout wrapper
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-charcoal-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Protected Seller Route Guard
const ProtectedSellerRoute: React.FC = () => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role !== 'seller') {
    return <Navigate to="/seller/login" replace />;
  }

  return <Outlet />;
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F2]">
        <div className="w-10 h-10 border-4 border-charcoal-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Customer-Facing Public Experience (Zero-Login Needed) */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/store/:slug" element={<SellerStorefrontPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:orderRef" element={<OrderConfirmationPage />} />
                <Route path="/track" element={<TrackOrderPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                {/* Seller Auth within customer layout */}
                <Route path="/seller/register" element={<SellerRegisterPage />} />
                <Route path="/seller/login" element={<SellerLoginPage />} />

                {/* Admin Login within customer layout */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Protected Seller Portal Dashboard */}
              <Route path="/seller" element={<ProtectedSellerRoute />}>
                <Route element={<SellerDashboardLayout />}>
                  <Route index element={<Navigate to="/seller/dashboard" replace />} />
                  <Route path="dashboard" element={<SellerOverviewPage />} />
                  <Route path="products" element={<SellerProductsPage />} />
                  <Route path="products/new" element={<SellerAddProductPage />} />
                  <Route path="orders" element={<SellerOrdersPage />} />
                  <Route path="delivery" element={<SellerDeliveryPage />} />
                  <Route path="profile" element={<SellerProfilePage />} />
                  <Route path="payouts" element={<SellerPayoutsPage />} />
                </Route>
              </Route>

              {/* Protected Admin Portal */}
              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
