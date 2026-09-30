import { randomUUID } from "node:crypto";

import {
  AgentDefinition,
  AgentHandler,
  AgentPolicy,
  AgentResult,
  AgentTask,
  AuditEvent,
  PermissionLevel,
} from "./types";
import { RuntimeStore } from "../persistence/runtime-store";
import { GovernanceController } from "../governance/controller";
import { ActionRisk } from "../governance/types";

export class AgentRuntime {
  private readonly agents = new Map<string, AgentDefinition>();
  private readonly policies = new Map<string, AgentPolicy>();
  private readonly handlers = new Map<string, AgentHandler>();
  private readonly auditEvents: AuditEvent[] = [];

  constructor(private readonly store?: RuntimeStore, private readonly governance?: GovernanceController) {}

  register(
    agent: AgentDefinition,
    policy: AgentPolicy,
    handler: AgentHandler,
  ): void {
    if (!agent.id || !agent.name || !agent.role) {
      throw new Error("Invalid agent definition.");
    }

    if (!policy.allowed_levels.length) {
      throw new Error(`Agent ${agent.id} has no allowed permission levels.`);
    }

    this.agents.set(agent.id, agent);
    this.policies.set(agent.id, policy);
    this.handlers.set(agent.id, handler);
  }

  getAgent(agentId: string): AgentDefinition {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Unknown agent: ${agentId}`);
    return agent;
  }

  getPolicy(agentId: string): AgentPolicy {
    const policy = this.policies.get(agentId);
    if (!policy) throw new Error(`No policy registered for agent: ${agentId}`);
    return policy;
  }

  authorize(
    agentId: string,
    level: PermissionLevel,
    task: AgentTask,
  ): void {
    const policy = this.getPolicy(agentId);

    if (!policy.allowed_levels.includes(level)) {
      throw new Error(
        `Permission denied: agent ${agentId} cannot use ${level}.`,
      );
    }

    if (level === "HIGH_IMPACT") {
      const approval = task.approval;
      if (!approval || approval.required !== true || approval.status !== "approved") {
        throw new Error("High-impact action requires explicit approval.");
      }
    }
  }

  private async persistTask(task: AgentTask, result?: AgentResult): Promise<void> {
    if (!this.store) return;
    await this.store.saveTask(task, result ? {
      status: result.status,
      summary: result.summary,
      evidence: result.evidence,
      artifacts: result.artifacts,
      next_actions: result.next_actions,
      risks: result.risks,
      approval_required: result.approval_required,
      audit_event_id: result.audit_event_id,
    } : undefined);
  }

  private async persistAuditEvent(event: AuditEvent): Promise<void> {
    if (!this.store) return;
    await this.store.saveAuditEvent(event);
  }

  async run(
    task: AgentTask,
    permissionLevel: PermissionLevel = "READ",
    scope = "task",
  ): Promise<AgentResult> {
    if (task.status !== "queued") {
      throw new Error(`Task ${task.task_id} cannot run from status ${task.status}.`);
    }

    const agent = this.getAgent(task.assigned_agent);
    const policy = this.getPolicy(task.assigned_agent);
    const handler = this.handlers.get(task.assigned_agent);

    if (!handler) throw new Error(`No handler registered for agent: ${agent.id}`);

    const auditBase = {
      event_id: randomUUID(),
      timestamp: new Date().toISOString(),
      company_id: task.company_id,
      agent_id: agent.id,
      task_id: task.task_id,
      action: "agent.run",
      permission_level: permissionLevel,
      scope,
      approval_id: task.approval?.approval_id ?? null,
    };

    try {
      this.authorize(agent.id, permissionLevel, task);

      if (this.governance) {
        const risk: ActionRisk = permissionLevel === "HIGH_IMPACT" ? "critical" :
          permissionLevel === "EXECUTE" ? "high" :
          permissionLevel === "WRITE" ? "medium" : "low";
        const governance = await this.governance.authorize(task, agent.id, permissionLevel, risk);
        if (!governance.allowed) {
          if (governance.approvalRequired) {
            task.status = "awaiting_approval";
            task.approval = { required: true, status: "pending", approval_id: governance.approvalId };
          }
          throw new Error(governance.reason ?? "Governance policy blocked execution.");
        }
      }

      if (task.dependencies?.length) {
        throw new Error("Task dependencies must be resolved before execution.");
      }

      task.status = "running";
      await this.persistTask(task);
      const output = await handler({ task, agent, policy });

      task.status = "completed";
      const event: AuditEvent = {
        ...auditBase,
        result: "success",
        evidence: output.evidence ?? [],
        error: null,
      };
      this.auditEvents.push(event);

      const result: AgentResult = {
        status: "completed",
        summary: output.summary,
        evidence: output.evidence ?? [],
        artifacts: output.artifacts ?? [],
        next_actions: output.next_actions ?? [],
        risks: output.risks ?? [],
        approval_required: false,
        audit_event_id: event.event_id,
      };
      await this.persistTask(task, result);
      await this.persistAuditEvent(event);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const blocked = message.startsWith("Permission denied") ||
        message.includes("requires explicit approval") ||
        message.includes("Governance policy") ||
        message.includes("dependencies");

      task.status = blocked ? "blocked" : "failed";

      const event: AuditEvent = {
        ...auditBase,
        result: blocked ? "blocked" : "failure",
        evidence: [],
        error: message,
      };
      this.auditEvents.push(event);

      const result: AgentResult = {
        status: blocked ? "blocked" : "failed",
        summary: message,
        evidence: [],
        artifacts: [],
        next_actions: blocked
          ? ["Resolve the permission, approval, or dependency blocker."]
          : ["Inspect the failure evidence and retry only if safe."],
        risks: blocked ? [] : ["Agent execution did not complete successfully."],
        approval_required: message.includes("requires explicit approval"),
        audit_event_id: event.event_id,
      };
      await this.persistTask(task, result);
      await this.persistAuditEvent(event);
      return result;
    }
  }

  getAuditEvents(): readonly AuditEvent[] {
    return this.auditEvents;
  }
}
