# 🛡️ Watchtower: Election Integrity Platform

**Watchtower** is an open-source AI + blockchain platform that monitors, verifies, and logs election-related incidents—bringing transparency, accountability, and real-time insights to voters, campaigns, and civic watchdogs.

---

## 🚀 What It Does

- 🗳️ **Voter Incident Reporting**  
  Users can report issues at polling places (e.g., equipment failure, intimidation, ballot problems) via a simple form.

- 🗺️ **Live Incident Dashboard**  
  Reports appear on a public dashboard map with metadata, summaries, and filtering.

- 🔗 **Blockchain Logging**  
  Each incident is cryptographically hashed and logged to the **Base Sepolia testnet** for immutable proof and transparency.

- 🔄 **Supabase Integration**  
  Incident data is stored in a managed Postgres DB for retrieval and analytics.

---

## 🧱 Tech Stack

| Layer         | Stack                          |
|---------------|---------------------------------|
| Frontend      | Next.js + TypeScript + Tailwind |
| Data          | Supabase (Postgres + REST)      |
| Blockchain    | Solidity + Hardhat (Base testnet) |
| Chain Interop | Ethers.js                        |

---

## 📦 Features (MVP)

- [x] Leaflet map with live incident markers
- [x] Incident submission form
- [x] Supabase-powered backend with REST API
- [x] Smart contract logging to Base testnet
- [x] Blockchain TX hash display per incident
- [x] Open-source, MIT licensed

---

## 🛠️ Local Dev Setup

```bash
git clone https://github.com/millbj92/watchtower.git
cd watchtower

# Install frontend dependencies
cd watchtower-dashboard
npm install
npm run dev

# Backend & blockchain (Hardhat)
cd ../blockchain
npm install
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## Create a .env.local in the dashboard folder:

```ini
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

# 📜 License
MIT – Use it, remix it, improve it. Just don’t rig elections 😉

# 🌍 Demo
Coming soon. This platform is designed for political transparency, civic tech, and activist deployment. Ideal for:

- Campaign use
- Civic tech orgs
- Election monitors



# 🧠 About
Watchtower was built by [Brandon Miller](https://github.com/millbj92) as part of a political tech initiative to make democracy more verifiable, transparent, and accountable through open-source tools.

```yaml
---

## 📈 Post-MVP Roadmap

| Feature | Description |
|--------|-------------|
| ✅ **Credibility Scoring System** | AI- and community-based credibility score for each incident |
| 🔄 **Auto-AI Summarization** | GPT/LLM summarization of incidents from transcripts or text |
| 📹 **Whisper Transcription** | Use Whisper to transcribe audio or video incident reports |
| 🔗 **Verified Reporting** | Add support for cryptographic user validation (ZK proof ready) |
| 🧠 **Bot/Spam Detection** | NLP filters + voting to block disinfo campaigns |
| 📱 **Mobile-First UI** | Responsive UX with installable PWA |
| 🧪 **Public Credibility Dashboard** | Heatmaps + incident severity over time |
| 🧩 **Plugin Support** | Allow orgs to build modules on top (alerts, notifications, etc.) |

---
```
