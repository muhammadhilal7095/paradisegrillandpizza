import type { ComponentType } from "react";
import {
  ClipboardCheck,
  Copyright,
  CreditCard,
  CupSoda,
  FileText,
  Pizza,
  Mail,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  UsersRound,
  type LucideProps,
} from "lucide-react";
import type { TermsIcon, TermsSection } from "../../data/terms";
import { Fries } from "../menu/categoryIcons";
import { PolicyCard } from "../policy/PolicyCard";

const ICONS: Record<TermsIcon, ComponentType<LucideProps>> = {
  file: FileText,
  bag: ShoppingBag,
  card: CreditCard,
  clipboard: ClipboardCheck,
  truck: Truck,
  star: Star,
  users: UsersRound,
  shield: ShieldCheck,
  copyright: Copyright,
  scale: Scale,
  mail: Mail,
};

const DOODLES: Partial<Record<number, ComponentType<LucideProps>>> = { 0: Pizza, 4: Fries, 8: CupSoda };

export function TermsCard({ section, index }: { section: TermsSection; index: number }) {
  return <PolicyCard section={section} index={index} icon={ICONS[section.icon]} doodle={DOODLES[index]} />;
}
