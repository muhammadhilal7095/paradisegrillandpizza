import { PolicyDocumentPage } from "../components/policy/PolicyDocumentPage";
import { REFUND_POLICY } from "../data/refunds";

export function RefundPage() {
  return (
    <PolicyDocumentPage
      name="Refund Policy"
      description="All sales are final. This policy explains our no-refund position and the limited cases in which UK law requires a refund."
      doc={REFUND_POLICY}
    />
  );
}
