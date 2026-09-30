import { MemoryItem, MemoryQuery, MemoryStore } from "./types";

type Config = { url: string; key: string; accessToken?: string };

export class SupabaseMemoryStore implements MemoryStore {
  private readonly endpoint: string;
  private readonly headers: Record<string,string>;

  constructor(config: Config) {
    if (!config.url || !config.key) throw new Error("Supabase URL and key are required.");
    this.endpoint = `${config.url.replace(/\/$/,"")}/rest/v1/company_memory_items`;
    this.headers = {
      apikey: config.key,
      Authorization: `Bearer ${config.accessToken ?? config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    };
  }

  async upsert(input: Omit<MemoryItem, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<MemoryItem> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ...(input.id ? { id: input.id } : {}),
        company_id: input.company_id,
        memory_type: input.memory_type,
        memory_key: input.memory_key,
        content: input.content,
        metadata: input.metadata,
        source_task_id: input.source_task_id ?? null,
        source_agent_id: input.source_agent_id ?? null,
        confidence: input.confidence,
        importance: input.importance,
      }),
    });
    if (!response.ok) throw new Error(`Supabase memory upsert failed: ${response.status} ${await response.text()}`);
    const rows = await response.json() as MemoryItem[];
    return rows[0];
  }

  async search(query: MemoryQuery): Promise<MemoryItem[]> {
    const params = new URLSearchParams();
    params.set("company_id", `eq.${query.company_id}`);
    if (query.memory_type) params.set("memory_type", `eq.${query.memory_type}`);
    params.set("order", "importance.desc,confidence.desc,updated_at.desc");
    params.set("limit", String(Math.min(Math.max(query.limit ?? 10, 1), 50)));
    if (query.query?.trim()) {
      const escaped = query.query.trim().replace(/,/g, " ");
      params.set("or", `(memory_key.ilike.*${escaped}*,content.ilike.*${escaped}*)`);
    }

    const response = await fetch(`${this.endpoint}?${params.toString()}`, {
      method: "GET",
      headers: this.headers,
    });
    if (!response.ok) throw new Error(`Supabase memory search failed: ${response.status} ${await response.text()}`);
    return await response.json() as MemoryItem[];
  }

  async get(companyId: string, memoryType: MemoryItem["memory_type"], memoryKey: string): Promise<MemoryItem | null> {
    const params = new URLSearchParams({
      company_id: `eq.${companyId}`,
      memory_type: `eq.${memoryType}`,
      memory_key: `eq.${memoryKey}`,
      limit: "1",
    });
    const response = await fetch(`${this.endpoint}?${params.toString()}`, { headers: this.headers });
    if (!response.ok) throw new Error(`Supabase memory get failed: ${response.status} ${await response.text()}`);
    const rows = await response.json() as MemoryItem[];
    return rows[0] ?? null;
  }
}