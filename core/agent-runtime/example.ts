import { AgentRuntime, AgentTask } from "./index";

const runtime = new AgentRuntime();

runtime.register(
  {
    id: "research",
    name: "Research Agent",
    role: "research",
    status: "planned",
    purpose: "Discover markets, customer problems, competitors, and evidence.",
  },
  {
    allowed_levels: ["READ", "WRITE"],
    can_delegate: false,
  },
  async ({ task }) => ({
    summary: `Research task accepted: ${task.objective}`,
    evidence: ["Runtime handler executed successfully."],
    next_actions: ["Collect approved research evidence."],
  }),
);

export async function smokeTest(): Promise<string> {
  const task: AgentTask = {
    task_id: "runtime-smoke-test",
    company_id: "companyforge-demo",
    objective: "Verify the research agent runtime.",
    assigned_agent: "research",
    inputs: {},
    constraints: [],
    dependencies: [],
    expected_outcome: "A structured runtime result.",
    approval: {
      required: false,
      status: "not_required",
    },
    status: "queued",
  };

  const result = await runtime.run(task, "READ");
  if (result.status !== "completed") {
    throw new Error(result.summary);
  }

  return result.summary;
}
