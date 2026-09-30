import { strict as assert } from "node:assert";
import { AgentRuntime, AgentTask } from "../core/agent-runtime";

function task(overrides: Partial<AgentTask> = {}): AgentTask {
  return {
    task_id: "test-task",
    company_id: "test-company",
    objective: "Test runtime execution",
    assigned_agent: "research",
    inputs: {},
    constraints: [],
    dependencies: [],
    expected_outcome: "Structured result",
    approval: { required: false, status: "not_required" },
    status: "queued",
    ...overrides,
  };
}

async function main() {
  const runtime = new AgentRuntime();

  runtime.register(
    {
      id: "research",
      name: "Research Agent",
      role: "research",
      status: "planned",
      purpose: "Research",
    },
    { allowed_levels: ["READ", "WRITE"] },
    async () => ({ summary: "ok", evidence: ["handler-ran"] }),
  );

  const success = await runtime.run(task(), "READ");
  assert.equal(success.status, "completed");
  assert.equal(success.summary, "ok");
  assert.equal(runtime.getAuditEvents().length, 1);

  const blocked = await runtime.run(
    task({
      task_id: "permission-test",
      status: "queued",
    }),
    "EXECUTE",
  );
  assert.equal(blocked.status, "blocked");

  const highImpactRuntime = new AgentRuntime();
  highImpactRuntime.register(
    {
      id: "builder",
      name: "Builder Agent",
      role: "builder",
      status: "planned",
      purpose: "Build",
    },
    { allowed_levels: ["READ", "WRITE", "HIGH_IMPACT"] },
    async () => ({ summary: "deployed" }),
  );

  const noApproval = await highImpactRuntime.run(
    task({
      task_id: "approval-test",
      assigned_agent: "builder",
    }),
    "HIGH_IMPACT",
  );
  assert.equal(noApproval.status, "blocked");

  const approved = await highImpactRuntime.run(
    task({
      task_id: "approved-test",
      assigned_agent: "builder",
      approval: {
        required: true,
        status: "approved",
        approval_id: "approval-1",
      },
    }),
    "HIGH_IMPACT",
  );
  assert.equal(approved.status, "completed");

  console.log("Agent runtime tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
