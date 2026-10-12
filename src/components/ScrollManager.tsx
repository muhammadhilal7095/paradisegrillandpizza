import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Starts each new page at the top, or at the #hash target when one is given.
 * Changing only the query string (e.g. the menu category filter) keeps the visitor's place.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
