import { Outlet, Route, Routes } from "react-router-dom";
import { GuestOnly, RequireAuth } from "./components/auth/RouteGuards";
import { Footer } from "./components/footer/Footer";
import { SiteHeader } from "./components/header/SiteHeader";
import { TopBar } from "./components/header/TopBar";
import { ScrollManager } from "./components/ScrollManager";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/auth/AccountPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OffersPage } from "./pages/OffersPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { RefundPage } from "./pages/RefundPage";
import { ReturnsPage } from "./pages/ReturnsPage";
import { TermsPage } from "./pages/TermsPage";

function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollManager />
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <TopBar />
      <SiteHeader />
      <div id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:category" element={<MenuPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/return" element={<ReturnsPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
