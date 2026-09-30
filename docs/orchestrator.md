# AI CEO Orchestrator

Converts a company objective into validated executable tasks.

## Flow
1. Receive company objective and constraints.
2. Retrieve relevant persistent company memory.
3. Provide the LLM with the approved agent catalog.
4. Generate a structured task plan.
5. Validate agent IDs, task IDs, priorities, fields, and dependencies.
6. Persist queued tasks through the runtime store.
7. Hand approved tasks to Agent Runtime for execution.

## Safety
The planner does not execute tasks or grant permissions. High-impact work remains approval-gated by Agent Runtime. A planning response is not evidence that work occurred.

## Live-provider status
Provider credentials and a successful end-to-end request are still required before live LLM planning can be claimed. Tests use a mock router.