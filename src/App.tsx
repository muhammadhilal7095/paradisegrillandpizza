import { Outlet, Route, Routes } from "react-router-dom";
import { GuestOnly, RequireAuth } from "./components/auth/RouteGuards";
import { Footer } from "./components/footer/Footer";
import { BurgerBiteHeader } from "./components/header/BurgerBiteHeader";
import { ScrollManager } from "./components/ScrollManager";
import { NAV_ITEMS } from "./config/navigation";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/auth/AccountPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { OffersPage } from "./pages/OffersPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ReturnsPage } from "./pages/ReturnsPage";
import { TermsPage } from "./pages/TermsPage";

const BUILT_PAGES: Record<string, React.ReactNode> = {
  "/": <HomePage />,
  "/menu": <MenuPage />,
  "/offers": <OffersPage />,
  "/gallery": <GalleryPage />,
  "/about": <AboutPage />,
  "/contact": <ContactPage />,
  "/terms": <TermsPage />,
  "/return": <ReturnsPage />,
};

function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <ScrollManager />
      <BurgerBiteHeader />
      <div className="flex-1">
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
        {NAV_ITEMS.map((item) => (
          <Route
            key={item.to}
            path={item.to}
            element={BUILT_PAGES[item.to] ?? <PlaceholderPage title={item.label} />}
          />
        ))}
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Route>
    </Routes>
  );
}
