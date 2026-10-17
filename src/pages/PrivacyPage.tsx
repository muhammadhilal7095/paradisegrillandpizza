import { PolicyDocumentPage } from "../components/policy/PolicyDocumentPage";
import { PRIVACY_POLICY } from "../data/privacy";

export function PrivacyPage() {
  return (
    <PolicyDocumentPage
      name="Privacy Policy"
      description="How Paradise Grill and Pizza collects, uses and protects your personal information, in line with the UK GDPR and the Data Protection Act 2018."
      doc={PRIVACY_POLICY}
    />
  );
}
