# CompanyForge Agent Runtime v0.2

The Agent Runtime is the execution boundary between CompanyForge tasks and agent handlers.

## Persistent state

The runtime now accepts a `RuntimeStore`. The repository includes `InMemoryRuntimeStore` for tests and `SupabaseRuntimeStore` for durable task and audit persistence. The live Supabase project uses `companies` as the ownership boundary, `runtime_tasks` for the full task contract, `audit_events` for durable execution evidence, and the existing `company_memory` table for company memory.

## What it does

- Registers agents with explicit policies.
- Rejects unknown agents.
- Enforces declared permission levels.
- Requires approval for HIGH_IMPACT actions.
- Rejects unresolved dependencies.
- Executes a registered handler.
- Produces a structured result.
- Emits an audit event for successful, blocked, and failed execution.

## What it does not do yet

The runtime does not yet connect to production LLM providers, GitHub mutations, databases, payments, deployment systems, or customer-facing channels. Those are separate integrations that must be permissioned and tested.

## Security posture

The runtime uses deny-by-default authorization: an action is permitted only when the agent policy explicitly contains the requested permission level.

High-impact operations require an approved task gate.

## Next integration boundary

The next implementation should connect this runtime to:
1. an LLM adapter;
2. agent/task orchestration persistence;
3. GitHub workspace operations;
4. approvals and autonomy controls;
5. durable company memory retrieval and writing.
