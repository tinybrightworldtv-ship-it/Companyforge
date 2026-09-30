# CompanyForge Agent Runtime v0.1

The Agent Runtime is the execution boundary between CompanyForge tasks and agent handlers.

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
1. persistent company/task storage;
2. an LLM adapter;
3. tool adapters;
4. GitHub workspace operations;
5. durable audit storage.
