import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, telHref } from "../../config/contact";
import { ORDER_PATH } from "../../config/site";
import { heroImage } from "../../data/menu";
import { buttonClasses } from "../ui/button";

const IMAGE = heroImage("contact", "Glowing red Take Away neon sign in a window at night");

/** Contact page banner with one-tap ways to reach the restaurant. */
export function ContactHero() {
  const phone = CONTACT.phones[0];
  const email = CONTACT.emails[0];
  const address = CONTACT.address.lines.join(", ");
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Paradise Grill and Pizza, ${address}`)}`;

  const actions = [
    { icon: Phone, label: "Call us", value: phone, href: telHref(phone), external: false },
    { icon: Mail, label: "Email us", value: email, href: `mailto:${email}`, external: false },
    { icon: MapPin, label: "Visit us", value: address, href: directions, external: true },
  ];

  return (
    <section aria-labelledby="contact-title" className="relative isolate overflow-hidden bg-deep text-white">
      <img
        src={IMAGE.large}
        srcSet={`${IMAGE.small} 960w, ${IMAGE.large} 1920w`}
        sizes="100vw"
        width={1920}
        height={880}
        alt={IMAGE.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover object-[60%_center] [filter:saturate(1.05)_contrast(1.05)] motion-safe:animate-[hero-zoom_14s_ease-out_both]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.82),rgba(5,5,5,0.92))] desk:bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.94)_32%,rgba(5,5,5,0.55)_58%,rgba(5,5,5,0.35)_100%)]" />

      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-10 md:px-6 md:py-14 desk:min-h-[480px] desk:grid-cols-[minmax(0,1fr)_380px] desk:px-8 desk:py-16 wide:px-12">
        <div className="max-w-[580px]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] backdrop-blur-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            Contact Us · Bath Road, Slough
          </p>
          <h1 id="contact-title" className="mt-4 font-display text-[38px] leading-[1.02] font-extrabold tracking-[-1px] md:text-[48px] desk:text-[58px] desk:tracking-[-1.6px]">
            <span className="block">Get in Touch.</span>
            <span className="block text-brand">We're Here to Help.</span>
          </h1>
          <p className="mt-4 max-w-[500px] text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            Questions about an order, allergies or catering for a party? Give us a call, send us a message or drop by our kitchen on Bath
            Road. We'll get back to you as soon as we can.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#message" className={buttonClasses("primary", "md", "shadow-[0_12px_30px_-10px_rgba(224,48,30,0.8)]")}>
              Send a message
              <ArrowDown size={17} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <Link to={ORDER_PATH} className={buttonClasses("outlineLight", "md")}>
              Order online
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* One-tap contact options */}
        <ul className="grid gap-3 rounded-2xl border border-white/15 bg-black/55 p-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md">
          {actions.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-white/[0.08]"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Icon size={19} strokeWidth={2.1} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold tracking-[0.08em] text-white/60 uppercase">{label}</span>
                  <span className="block text-[14px] leading-snug font-semibold break-words">{value}</span>
                  {external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
                </span>
                <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
