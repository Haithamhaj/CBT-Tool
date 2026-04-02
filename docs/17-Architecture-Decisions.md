# Architecture Decisions

## Purpose
This document resolves the remaining MVP architecture choices so implementation can proceed without reopening foundational stack debates.

## Final MVP Stack Choices

### Backend platform: Supabase
Use Supabase for MVP backend services:
- PostgreSQL database
- Supabase Auth
- Row Level Security
- Storage if needed later for case assets or exports
- Next.js server routes for application orchestration

### AI provider: OpenAI
Use OpenAI as the only MVP AI provider for evaluator calls:
- Category classifier
- AI-assisted drift detection where rules are insufficient
- Feedback coach
- Session evaluator

## Why Supabase Over Firebase

### Supabase advantages for this product
- The product already assumes relational tables: `users`, `cases`, `sessions`, `attempts`, `drift_events`, and `progress_snapshots`.
- Scoring, audits, facilitator summaries, and cohort analytics are easier with SQL than document joins.
- Row Level Security maps cleanly to trainee/facilitator access boundaries.
- PostgreSQL supports structured JSON fields without giving up relational integrity.
- Migrations and seed data are more predictable for a rules-heavy training platform.

### Firebase trade-offs
- Firebase is faster for simple real-time apps, but this product is not primarily a real-time collaboration tool.
- Firestore would make evaluator outputs and nested attempt history easy to store, but cross-session reporting becomes harder and noisier.
- Security rules would need more careful duplication of business constraints already better expressed through SQL and service logic.

### Final judgment
Supabase is the more coherent MVP choice because the product needs auditable relational data, aggregate reporting, and controlled role-based access more than it needs document-first flexibility.

## Why OpenAI Over Gemini

### OpenAI advantages for this product
- Strong support for structured JSON outputs, which is a hard requirement in the PRD.
- Reliable tool and schema-oriented prompting patterns for evaluator services.
- Better fit for contract testing of evaluator outputs.
- Easier future alignment with versioned prompts and typed response validation.

### Gemini trade-offs
- Gemini may be cost-competitive and strong on broad reasoning, but JSON strictness and consistency are more important than open-ended generation quality for MVP.
- A provider switch during MVP would add test and prompt instability with little product benefit.

### Final judgment
OpenAI is the better MVP choice because evaluator reliability and schema adherence matter more than optional provider flexibility.

## Application Boundary

### Client
- Next.js App Router UI
- Server Components for read-heavy screens where appropriate
- Client Components for guided practice interactions

### Server
- Next.js API routes as the application service layer
- Route handlers call domain services for session flow, validation, scoring, and evaluator orchestration
- Supabase is the system of record

### Service separation rule
The following must remain separate modules even if they live in the same codebase:
- `sessionFlow`
- `rulesEngine`
- `scoringEngine`
- `evaluatorService`
- `analyticsService`

Hard rules must execute before any AI-generated interpretation is considered authoritative.

## MVP Operating Decisions

### Authentication
- Email magic-link authentication only
- No username/password in MVP
- Role is assigned in database metadata

### Authorization
- Trainees can access only their own sessions, attempts, drifts, and progress
- Facilitators can read cohort-level summaries and assigned trainee records
- Admin tooling is postponed

### Case management
- Cases are seeded from static JSON and synced into the database
- No case authoring UI in MVP

### Evaluator execution model
- Evaluators run on demand from server routes
- No background job queue in MVP
- All evaluator outputs must be validated against application schemas before persistence

### Persistence strategy
- A session owns many attempts
- Attempts persist step-level inputs and outputs
- Drift events are persisted separately for analytics and remediation

## What Is Intentionally Postponed
- Firebase support
- Multiple AI providers
- Real-time collaborative sessions
- Supervisor/admin content authoring UI
- Advanced cohort assignment workflows
- Arabic localization
- Offline mode
- Background evaluator queues
- Audio or voice interfaces
- Export pipelines
- Fine-tuned or custom models

## Non-negotiable Constraints
- The product is a CBT training tool, not a therapy product.
- Rules-based validation and AI feedback must remain separately testable.
- Every evaluator response must pass schema validation before use.
- Every score must be reconstructable from persisted attempt data, rule outputs, and evaluator outputs.

## Ready-to-build blockers remaining
- Finalize the initial seeded case set and its JSON format examples.
- Confirm facilitator-to-trainee assignment rules for MVP cohorts.
- Define exact prompt versioning and model version pinning policy.
