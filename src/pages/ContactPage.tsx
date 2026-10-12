import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactInformation } from "../components/contact/ContactInformation";
import { FollowUsSection } from "../components/contact/FollowUsSection";
import { LocationCard } from "../components/contact/LocationCard";
import { OpeningHoursCard } from "../components/contact/OpeningHoursCard";
import { buttonClasses } from "../components/ui/button";
import { ClosingBanner } from "../components/ui/ClosingBanner";
import { PageHero } from "../components/ui/PageHero";
import { ORDER_PATH } from "../config/site";

const container = "mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8";

export function ContactPage() {
  return (
    <main>
      <PageHero
        titleId="contact-title"
        eyebrow="Get in Touch"
        titleTop="We'd Love to"
        titleBottom="Hear From You"
        description="Have a question, feedback or a special request? We're always here to serve you better."
        image={{
          small: "/images/contact-hero-960.webp",
          large: "/images/contact-hero-1920.webp",
          width: 1920,
          height: 700,
          alt: "Stacked beef burger with bacon and melted cheese on a dark background",
        }}
        annotation="Fresh Food, Happy People"
      >
        <Link to={ORDER_PATH} className={buttonClasses("primary", "md", "mt-7")}>
          Order Now
          <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </PageHero>

      <div className="bg-white py-14 md:py-16">
        <div className={`${container} grid gap-6 lg:grid-cols-[minmax(0,48fr)_minmax(0,52fr)]`}>
          <ContactInformation />
          <ContactForm />
        </div>
        <div className={`${container} mt-6 grid gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]`}>
          <LocationCard />
          <OpeningHoursCard />
        </div>
      </div>

      <FollowUsSection />

      <ClosingBanner
        titleId="stay-connected-title"
        slogan={["Fresh Food", "Brighter Days"]}
        sloganAccentFrom={1}
        titleTop="Let's Stay"
        titleBottom="Connected"
        titleAccent={<Heart size={26} strokeWidth={2} aria-hidden="true" className="ml-2 inline-block -translate-y-1 align-middle" />}
        image={{
          src: "/images/contact-banner.webp",
          width: 1200,
          height: 800,
          alt: "Double cheeseburger with melted cheese on a dark background",
        }}
      />
    </main>
  );
}
