import type { Metadata } from "next";
import { LegalDocument } from "@/components/site-chrome";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <p>
        This is a demo placeholder. The live Recology customer portal privacy policy will replace this page. No
        personal information entered here is stored or sent.
      </p>
      <p>
        Account numbers, invoice numbers, and contact details you type stay in your browser only for the length of
        this session.
      </p>
    </LegalDocument>
  );
}
