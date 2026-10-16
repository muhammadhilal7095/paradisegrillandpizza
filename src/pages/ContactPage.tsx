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

import { heroImage, menuImage } from "../data/menu";

export function ContactPage() {
  return (
    <main>
      <PageHero
        titleId="contact-title"
        eyebrow="Get in Touch"
        titleTop="We'd Love to"
        titleBottom="Hear From You"
        description="Questions about your order, allergies or a large party booking? Call, message or drop in. We're happy to help."
        image={heroImage("contact", "Pizza on a peel beside a wood-fired oven")}
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
        slogan={["Fresh Food", "Friendly Faces"]}
        sloganAccentFrom={1}
        titleTop="Let's Stay"
        titleBottom="Connected"
        titleAccent={<Heart size={26} strokeWidth={2} aria-hidden="true" className="ml-2 inline-block -translate-y-1 align-middle" />}
        image={{
          src: menuImage("peri-half-chicken", 1080),
          width: 1080,
          height: 1080,
          alt: "Flame-grilled peri peri chicken on a rack",
        }}
      />
    </main>
  );
}
