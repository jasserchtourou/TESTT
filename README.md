# Sales Briefing System Design

A system design for automating municipality solar potential briefings for B2B sales engineers.

## Problem
Sales engineers manually spend 2-4 hours researching building data, solar potential, and CRM information for each municipality. This system automates that in 2-3 minutes.

## Solution
Type a municipality name → system generates a structured briefing with:
- Solar potential analysis (top buildings)
- PV system sizing & financial projections
- CRM context (active deals, contacts)
- Recommendation (prioritized prospects)

## Key Features
- **Pre-filtering**: Reduces 50k buildings to 5k via roof geometry (static, fast)
- **Selective API calls**: Queries Google Solar API for top 50 only (99% cost reduction)
- **Deterministic math**: All financial numbers from verified code (no AI hallucination)
- **CRM intelligence**: Fuzzy address matching to link buildings to HubSpot deals
- **Smart narratives**: LLM writes summary text only (numbers injected from calculations)

## Architecture Highlights
- **Frontend**: React 18 + Vite
- **API**: Node.js/Express on AWS ECS Fargate
- **Database**: PostgreSQL RDS + PostGIS for spatial queries
- **Cache**: Redis ElastiCache (geocoding, solar results)
- **External**: Google Solar API, HubSpot CRM API
- **Deployment**: AWS (ALB, ECS, RDS, ElastiCache, S3, CloudFront CDN)

## Performance
- Geocoding: 500ms (cached)
- Pre-filter: 800ms (50k→5k buildings)
- Solar API: 1-2 min (top 50 only)
- PV Math: 100ms (deterministic)
- CRM Join: 200ms (fuzzy matching)
- LLM Narrative: 2-3 sec (text only)
- **Total: 2-3 minutes per briefing @ €1.50 cost**

## Design Decisions
1. **Municipality lookup**: Geocoding + fuzzy matching (handles typos, cached)
2. **PV strategy**: Pre-filter 50k→5k, compute top 50 only (€1.50 vs €1,500)
3. **AI role**: NLP for matching + LLM for narrative text only (no financial numbers)
4. **CRM join**: Fuzzy address matching + coordinate proximity (robust)

## V1 (2-week ship)
- On-demand solar computation (not pre-computed)
- Read-only CRM integration
- Single LLM call (simple, not agentic)
- Core filtering logic (pre-filter + selective APIs)

## Risk Mitigation
- Pydantic schemas validate all outputs
- AI writes text only; numbers from verified code
- Circuit breaker for API failures
- OAuth2 + TLS 1.3 encryption
- Audit logging (GDPR compliant)

## Presentation
17-slide professional presentation with UML diagrams:
- Component Diagram (system architecture)
- Deployment Diagram (AWS infrastructure)
- Sequence Diagram (7-step workflow)

View at `http://localhost:3000` (run `npm start`)

---

**Design Philosophy**: Reduce expensive API calls by 99% through intelligent pre-filtering of static data. Only compute what matters.
