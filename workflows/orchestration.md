# CompanyForge Orchestration Rules v0.1

## Objective

The orchestrator converts company outcomes into executable, traceable work.

## Execution cycle

1. Receive company objective.
2. Inspect company context and memory.
3. Decompose objective into tasks.
4. Select agents based on role and required capability.
5. Check permissions and dependencies.
6. Queue executable tasks.
7. Run tasks within declared scope.
8. Collect evidence and artifacts.
9. Route outputs to dependent agents.
10. Send work to QA/Critic when required.
11. Request human approval for gated actions.
12. Record the result and update company state.
13. Identify the next measurable outcome.

## Delegation rules

- The CEO/Orchestrator owns delegation.
- Agents may not silently expand their scope.
- An agent may recommend another agent but may not grant itself additional permissions.
- Dependency failures block downstream tasks rather than being silently ignored.
- Conflicting agent recommendations must be surfaced to the orchestrator.
- High-impact actions remain gated until an authorized approval exists.

## Builder workflow

Research/Strategy/Product
→ approved implementation task
→ Builder
→ QA/Critic
→ approval if required
→ merge/deploy workflow
→ Analytics
→ measured outcome
→ improvement task

## Failure handling

If an agent fails:
- preserve the failure evidence;
- classify the failure;
- retry only when safe and useful;
- escalate repeated or high-impact failures;
- never report success without execution evidence.

## Autonomous loop

Company goal
→ measured gap
→ task generated
→ agent execution
→ verification
→ outcome measurement
→ learning
→ next task

This loop is the foundation for continuous improvement.
