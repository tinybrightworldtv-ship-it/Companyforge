# Task Orchestration Engine

Consumes validated queued Agent Tasks.
- Executes only when dependencies are completed.
- Uses Agent Runtime for authorization, approvals, execution, and audit events.
- Retries unsuccessful execution up to the configured limit.
- Converts approval/permission blockers into awaiting-approval.
- Blocks downstream tasks when a dependency fails.

The engine cannot approve high-impact work. Durable queue workers and distributed scheduling are later infrastructure work.
