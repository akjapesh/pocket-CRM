export type DealStage =
  | "Prospecting"
  | "Qualified"
  | "Demo"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type Channel =
  | "WhatsApp Call"
  | "WhatsApp Voice Note"
  | "Phone Call"
  | "In-Person"
  | "Video Call";

export type Temperature = "Cold" | "Cool" | "Warm" | "Hot";

export type ContactRole =
  | "Decision Maker"
  | "Champion"
  | "Influencer"
  | "Blocker"
  | "Gatekeeper"
  | "End User";

export type Segment = "B2B SaaS" | "Field Sales";

export interface Contact {
  id: string;
  name: string;
  title: string;
  role: ContactRole;
  temperature: Temperature;
  /** 0-100 relationship health for this person */
  rapport: number;
  reportsTo?: string;
  notes: string;
  /** informal/rapport signals VoiceLog picked up */
  signals: string[];
}

export interface Blocker {
  id: string;
  type:
    | "Pricing"
    | "Budget Cycle"
    | "Internal Approval"
    | "Competitor"
    | "Timeline"
    | "Technical"
    | "Trust";
  severity: "Low" | "Medium" | "High";
  summary: string;
  suggestedAction: string;
  raisedOn: string;
}

export interface ExtractedFields {
  stageSignal: DealStage;
  nextSteps: string[];
  objections: string[];
  competitors: string[];
  pricingDiscussed: string;
  sentiment: "Positive" | "Neutral" | "Negative" | "Mixed";
  bant: {
    budget: string;
    authority: string;
    need: string;
    timeline: string;
  };
  orgSignals: string[];
  relationshipSignals: string[];
}

export interface TranscriptLine {
  speaker: string;
  /** "rep" | "prospect" */
  side: "rep" | "prospect";
  text: string;
  /** seconds offset for fake timeline */
  t: number;
  /** indices of fields this line drove extraction for (for highlight) */
  drives?: string[];
}

export interface Conversation {
  id: string;
  accountId: string;
  title: string;
  channel: Channel;
  language: string;
  date: string;
  durationMin: number;
  rep: string;
  transcript: TranscriptLine[];
  extracted: ExtractedFields;
  /** what got pushed to CRM */
  crmPush: {
    target: "HubSpot" | "Zoho" | "Salesforce" | "Pipedrive";
    payload: Record<string, unknown>;
  };
}

export interface Account {
  id: string;
  name: string;
  segment: Segment;
  industry: string;
  region: string;
  logoColor: string;
  initials: string;
  dealStage: DealStage;
  dealValue: number; // in the account currency, INR or USD
  currency: "INR" | "USD";
  probability: number;
  /** account-level relationship health 0-100 */
  relationshipScore: number;
  owner: string;
  /** if the account is being handed over */
  handover?: {
    fromRep: string;
    toRep: string;
    reason: string;
    date: string;
  };
  lastTouch: string;
  contacts: Contact[];
  blockers: Blocker[];
  conversationIds: string[];
}
