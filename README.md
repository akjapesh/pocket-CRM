# VoiceLog — Sales conversations, CRM-readable

> Your CRM was built to record selling. But selling now happens on WhatsApp, on calls, and across a chai-table — none of which write to your CRM.

VoiceLog captures the highest-signal sales conversations (WhatsApp calls, phone calls, in-person meetings) and turns them into **CRM-structured deal, org, and relationship intelligence** — with an India-first focus (Hindi/Hinglish, WhatsApp-call capture, offline field sales).

This repo is a **UI-only prototype with dummy data** built for the EF hackathon pitch. No backend, no real recording — every number and transcript is illustrative.

## What it shows

| Screen | Route | Purpose |
| --- | --- | --- |
| **Deal Health** | `/` | Pipeline, relationship-health scores, and high-severity blockers across accounts |
| **Account** | `/accounts/[id]` | Auto-built org map (champion vs decision-maker), per-contact relationship temperature, blockers + suggested actions |
| **Conversation** | `/conversations/[id]` | Transcript → extracted structured fields (BANT, objections, competitors, next steps, org & relationship signals). Click a transcript line to see what it extracted. |
| **Live Capture** | `/capture` | Animated record → transcribe → extract simulation |
| **Handover** | `/handover/[id]` | Cold vs warm handover: what a successor rep inherits today vs with VoiceLog |
| **CRM Sync** | (on conversation) | Structured JSON pushed to HubSpot / Zoho / Salesforce |

## Differentiation (the wedge)

Generic note-takers (Plaud, Omi, Limitless) optimize for personal memory; Gong/Chorus do desk-based virtual-call intelligence. VoiceLog's white space:

- **India-first capture** — WhatsApp calls + Hinglish + offline field areas
- **Sales-specific extraction schema** — not generic meeting notes
- **Org & relationship mapping** — champion vs economic buyer, relationship temperature, deal blockers
- **Cold → warm handover** — institutional memory that survives rep attrition

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react.

Dummy data lives in [`src/lib/data.ts`](src/lib/data.ts); types in [`src/lib/types.ts`](src/lib/types.ts).
