import type { Metadata } from "next";
import { LegalDocument } from "@/components/site-chrome";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Use">
      <p>
        This is a demo placeholder for the Recology customer portal terms. The screens mirror the current portal
        labels so the experience feels familiar. They are not the production terms.
      </p>
      <p>Nothing you submit creates a real account, changes service, or moves money.</p>
    </LegalDocument>
  );
}
