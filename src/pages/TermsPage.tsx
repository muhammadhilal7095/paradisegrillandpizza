import { PolicyDocumentPage } from "../components/policy/PolicyDocumentPage";
import { TERMS } from "../data/terms";

export function TermsPage() {
  return (
    <PolicyDocumentPage
      name="Terms and Conditions"
      description="The terms that apply when you order from Paradise Grill and Pizza or use this website. Please read them before placing an order."
      doc={TERMS}
    />
  );
}
