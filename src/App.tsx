import { Outlet, Route, Routes } from "react-router-dom";
import { BurgerBiteHeader } from "./components/header/BurgerBiteHeader";
import { NAV_ITEMS } from "./config/navigation";
import { PlaceholderPage } from "./pages/PlaceholderPage";

function Layout() {
  return (
    <>
      <BurgerBiteHeader />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {NAV_ITEMS.map((item) => (
          <Route key={item.to} path={item.to} element={<PlaceholderPage title={item.label} />} />
        ))}
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Route>
    </Routes>
  );
}
