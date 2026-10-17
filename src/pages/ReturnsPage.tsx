import { PolicyDocumentPage } from "../components/policy/PolicyDocumentPage";
import { RETURN_POLICY } from "../data/returns";

export function ReturnsPage() {
  return (
    <PolicyDocumentPage
      name="Return Policy"
      description="Our food is freshly prepared to order, so we do not accept returns. This policy explains why, and what to do if something is wrong with your order."
      doc={RETURN_POLICY}
    />
  );
}
