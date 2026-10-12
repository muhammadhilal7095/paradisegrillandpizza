import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Starts each new page at the top, or at the #hash target when one is given.
 * Hash jumps within the same page scroll smoothly (unless reduced motion is preferred).
 * Changing only the query string (e.g. a menu filter) keeps the visitor's place.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const lastPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      target.scrollIntoView({ block: "start", behavior: samePage && !prefersReducedMotion() ? "smooth" : "auto" });
    } else if (!samePage) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
