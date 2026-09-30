import { AgentTask, AuditEvent } from "../agent-runtime/types";
import { RuntimeStore } from "./runtime-store";

type SupabaseRuntimeStoreConfig = {
  url: string;
  key: string;
  accessToken?: string;
};

export class SupabaseRuntimeStore implements RuntimeStore {
  private readonly restUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: SupabaseRuntimeStoreConfig) {
    if (!config.url || !config.key) {
      throw new Error("Supabase URL and key are required.");
    }

    this.restUrl = `${config.url.replace(/\/$/, "")}/rest/v1`;
    this.headers = {
      apikey: config.key,
      Authorization: `Bearer ${config.accessToken ?? config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    };
  }

  async saveTask(task: AgentTask, result?: Record<string, unknown>): Promise<void> {
    const response = await fetch(`${this.restUrl}/runtime_tasks`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        id: task.task_id,
        company_id: task.company_id,
        parent_task_id: task.parent_task_id ?? null,
        objective: task.objective,
        assigned_agent: task.assigned_agent,
        priority: task.priority ?? "normal",
        inputs: task.inputs,
        constraints: task.constraints ?? [],
        dependencies: task.dependencies ?? [],
        expected_outcome: task.expected_outcome,
        approval_required: task.approval?.required ?? false,
        approval_status: task.approval?.status ?? "not_required",
        approval_id: task.approval?.approval_id ?? null,
        status: task.status,
        result: result ?? null,
      }),
    });

    if (!response.ok) {
      throw new Error(`Supabase task persistence failed: ${response.status} ${await response.text()}`);
    }
  }

  async saveAuditEvent(event: AuditEvent): Promise<void> {
    const response = await fetch(`${this.restUrl}/audit_events`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        id: event.event_id,
        company_id: event.company_id,
        agent_id: event.agent_id,
        runtime_task_id: event.task_id,
        action: event.action,
        permission_level: event.permission_level,
        scope: event.scope,
        approval_id: event.approval_id,
        result: event.result,
        evidence: event.evidence,
        error: event.error,
      }),
    });

    if (!response.ok) {
      throw new Error(`Supabase audit persistence failed: ${response.status} ${await response.text()}`);
    }
  }
}

export function createSupabaseRuntimeStoreFromEnv(): SupabaseRuntimeStore {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_PUBLISHABLE_KEY.");
  }

  return new SupabaseRuntimeStore({ url, key, accessToken });
}
