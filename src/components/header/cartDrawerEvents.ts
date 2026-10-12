const OPEN_CART = "burgerbite:open-cart";

export interface OpenCartDetail {
  /** Element to refocus when the drawer closes. */
  trigger?: HTMLElement | null;
}

/** Ask the header to open its cart drawer from anywhere on the page. */
export function openCartDrawer(trigger?: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent<OpenCartDetail>(OPEN_CART, { detail: { trigger } }));
}

export function onOpenCartRequest(handler: (detail: OpenCartDetail) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<OpenCartDetail>).detail ?? {});
  window.addEventListener(OPEN_CART, listener);
  return () => window.removeEventListener(OPEN_CART, listener);
}
