import { ContactHero } from "../components/contact/ContactHero";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactInformation } from "../components/contact/ContactInformation";
import { FollowUsSection } from "../components/contact/FollowUsSection";
import { LocationCard } from "../components/contact/LocationCard";
import { OpeningHoursCard } from "../components/contact/OpeningHoursCard";

const container = "mx-auto max-w-[1200px] px-4 md:px-6 desk:px-8";


export function ContactPage() {
  return (
    <main>
      <ContactHero />

      <div id="message" className="scroll-mt-20 bg-white py-14 md:py-16">
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

    </main>
  );
}
