export interface Connector {
  id: string;
  name: string;
  color: string;
  category: "CRM" | "Lightweight";
  blurb: string;
  popular?: boolean;
}

export const connectors: Connector[] = [
  { id: "hubspot", name: "HubSpot", color: "#ff7a59", category: "CRM", blurb: "Marketing & sales CRM", popular: true },
  { id: "salesforce", name: "Salesforce", color: "#00a1e0", category: "CRM", blurb: "Enterprise CRM" },
  { id: "zoho", name: "Zoho CRM", color: "#e42527", category: "CRM", blurb: "SMB CRM, popular in India", popular: true },
  { id: "pipedrive", name: "Pipedrive", color: "#1a8a3f", category: "CRM", blurb: "Sales-first pipeline CRM" },
  { id: "freshsales", name: "Freshsales", color: "#9c5fff", category: "CRM", blurb: "Freshworks sales suite" },
  { id: "dynamics", name: "Dynamics 365", color: "#0078d4", category: "CRM", blurb: "Microsoft enterprise CRM" },
  { id: "sheets", name: "Google Sheets", color: "#0f9d58", category: "Lightweight", blurb: "For teams still on spreadsheets" },
];

export function getConnector(id: string) {
  return connectors.find((c) => c.id === id);
}

/** Map a CRM display name (used in conversation payloads) to a connector id. */
export const targetToConnector: Record<string, string> = {
  HubSpot: "hubspot",
  Salesforce: "salesforce",
  Zoho: "zoho",
  Pipedrive: "pipedrive",
  Freshsales: "freshsales",
  "Dynamics 365": "dynamics",
};

/** OAuth scopes shown on the authorize step. */
export const authScopes = [
  "Read & write Contacts and Companies",
  "Read & write Deals / Opportunities",
  "Create Tasks and Activities",
  "Create custom properties (relationship health, blockers)",
];

/** Default VoiceLog → CRM field mapping shown in the wizard. */
export interface FieldMap {
  voicelog: string;
  options: string[];
}

export const fieldMappings: FieldMap[] = [
  { voicelog: "Deal stage signal", options: ["Deal Stage", "Opportunity Stage", "— skip —"] },
  { voicelog: "Next steps", options: ["Tasks / Activities", "Note", "— skip —"] },
  { voicelog: "Objections", options: ["Custom: Objections", "Note", "— skip —"] },
  { voicelog: "Competitors mentioned", options: ["Custom: Competitor", "Note", "— skip —"] },
  { voicelog: "Contacts & roles", options: ["Contacts (with role)", "Note", "— skip —"] },
  { voicelog: "Org / relationship map", options: ["Custom object: Relationships", "Note", "— skip —"] },
  { voicelog: "Relationship health", options: ["Custom: Relationship Score", "— skip —"] },
];

export interface SyncPref {
  id: string;
  label: string;
  desc: string;
  default: boolean;
}

export const syncPrefs: SyncPref[] = [
  { id: "auto", label: "Auto-sync after each conversation", desc: "Push structured data the moment a call is processed.", default: true },
  { id: "twoway", label: "Two-way sync", desc: "Pull deal context before a call so reps walk in prepped.", default: true },
  { id: "tasks", label: "Create tasks for next steps", desc: "Turn extracted action items into CRM tasks.", default: true },
  { id: "contacts", label: "Create / update contacts & org map", desc: "Auto-build the account org chart in your CRM.", default: true },
  { id: "score", label: "Push relationship health score", desc: "Write a custom property managers can filter on.", default: false },
];
