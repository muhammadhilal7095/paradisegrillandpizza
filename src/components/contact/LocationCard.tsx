import { ArrowRight, MapPin } from "lucide-react";
import { CONTACT, CONTACT_DETAILS_VERIFIED } from "../../config/contact";
import { buttonClasses } from "../ui/button";

const address = CONTACT.address.lines.join(", ");
const { lat, lng } = CONTACT.address;
const hasPin = CONTACT_DETAILS_VERIFIED && lat !== undefined && lng !== undefined;

/** OpenStreetMap embed — no API key needed. Only used for a verified, pinned address. */
function MapEmbed({ lat, lng }: { lat: number; lng: number }) {
  const bbox = [lng - 0.008, lat - 0.004, lng + 0.008, lat + 0.004].map((n) => n.toFixed(5)).join(",");
  return (
    <iframe
      title={`Map showing BurgerBite at ${address}`}
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
      loading="lazy"
      className="size-full border-0"
    />
  );
}

/** Stylised street grid with a pin — clearly labelled as a preview, never a real location. */
function MapPreview() {
  return (
    <div className="relative size-full overflow-hidden bg-mist" role="img" aria-label="Map preview — our location is still to be confirmed">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(#e6e6e6_1px,transparent_1px),linear-gradient(90deg,#e6e6e6_1px,transparent_1px)] bg-size-[28px_28px]"
      />
      <div aria-hidden="true" className="absolute inset-y-0 left-[38%] w-3 -skew-x-12 bg-white" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[58%] h-3 -rotate-3 bg-white" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[22%] h-2 rotate-6 bg-white/80" />
      <div aria-hidden="true" className="absolute top-[18%] left-[62%] h-[35%] w-[22%] rounded-lg bg-[#e8f0e2]" />
      <span aria-hidden="true" className="absolute top-[calc(58%-46px)] left-[calc(38%-14px)] flex flex-col items-center text-brand drop-shadow">
        <MapPin size={40} strokeWidth={1.6} fill="currentColor" className="text-brand [&>circle]:fill-white" />
      </span>
      <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-soft shadow-sm">
        Map preview · location to be confirmed
      </span>
    </div>
  );
}

export function LocationCard() {
  return (
    <section aria-labelledby="find-us-title" className="flex flex-col rounded-2xl border border-line bg-white p-6 md:p-7">
      <h2 id="find-us-title" className="font-display text-[22px] leading-tight font-extrabold tracking-[-0.4px] text-ink md:text-[24px]">
        Find Us <span className="text-brand">Here</span>
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Visit our restaurant and enjoy your favourite meals in a warm and friendly atmosphere.
      </p>
      <div className="mt-5 h-[220px] overflow-hidden rounded-xl border border-line md:h-[230px]">
        {hasPin ? <MapEmbed lat={lat!} lng={lng!} /> : <MapPreview />}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-start gap-1.5 text-[13px] text-soft">
          <MapPin size={15} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
          {address}
        </p>
        {CONTACT_DETAILS_VERIFIED ? (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary", "sm")}
          >
            Get Directions
            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="text-[12px] text-muted">Directions will be available once our address is confirmed.</p>
        )}
      </div>
    </section>
  );
}
