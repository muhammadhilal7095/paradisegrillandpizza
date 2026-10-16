import { createContext, useContext } from "react";
import type { Catalog } from "../data/menu";

/**
 * The menu context and hook live apart from MenuProvider so that editing the provider during
 * development hot-reloads cleanly (a module exporting both a component and a hook can't be
 * fast-refreshed, and a re-created context breaks every useMenu() call until a full reload).
 */

/** "loading" until the POS API answers; "ready" with products; "unavailable" when it can't be loaded. */
export type MenuStatus = "loading" | "ready" | "unavailable";

export interface MenuContextValue extends Catalog {
  status: MenuStatus;
  /** Try loading the menu again (e.g. from the "menu unavailable" message). */
  reload: () => void;
}

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within a MenuProvider");
  return ctx;
}
