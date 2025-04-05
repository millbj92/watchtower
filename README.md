### MVP Issues – Watchtower

#### Frontend
- [ ] Connect IncidentForm to live incident state
- [ ] Display new incidents on map & list after submission
- [ ] Add incident filters (by type, location, date)
- [ ] Add stats section (incident count, report trends)
- [ ] Add loading/error states for network calls
- [ ] Display blockchain TX link on incident (placeholder for now)

#### Backend
- [ ] Set up minimal API with FastAPI or Express
- [ ] Create POST /incident endpoint
- [ ] Create GET /incidents endpoint
- [ ] (Optional) Store incidents in Supabase or Firebase

#### Blockchain
- [ ] Write simple Solidity contract for `logIncident(bytes32, uint256)`
- [ ] Deploy to Base testnet
- [ ] Add logging function in backend or frontend
- [ ] Connect TX hash to frontend display

#### UI Polish
- [ ] Add branding (logo, campaign message)
- [ ] Style incident cards and form nicely
- [ ] Add footer with campaign info

#### Docs
- [ ] Update README with MVP usage instructions
- [ ] Create `architecture.md` for app + chain flow
