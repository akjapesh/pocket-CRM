import { PageHeader } from "@/components/PageHeader";
import { IntegrationsView } from "@/components/IntegrationsView";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connect VoiceLog to the CRM you already use. After every conversation, structured deal, org & relationship data is pushed automatically — no manual data entry."
      />
      <IntegrationsView />
    </div>
  );
}
