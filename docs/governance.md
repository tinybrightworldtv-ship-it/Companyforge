# Approval & Autonomy Governance

CompanyForge separates what the AI plans from what the AI is permitted to execute.

## Autonomy levels
- manual: every meaningful action requires approval.
- assisted: AI prepares work; medium+ risk requires approval.
- supervised: routine permitted work can execute; high/critical risk requires approval.
- autonomous: most permitted work can execute; critical risk remains approval-gated.

## Approval flow
1. Task reaches execution.
2. Governance evaluates company policy, permission level, and action risk.
3. If approval is required, an Approval Request is created.
4. Task remains blocked/awaiting approval.
5. Human approves or rejects the request.
6. Only approved work may proceed through Agent Runtime.

Governance never grants permissions that Agent Runtime does not grant.