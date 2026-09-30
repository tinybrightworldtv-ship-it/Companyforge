import { randomUUID } from "node:crypto";
import { MemoryItem, MemoryQuery, MemoryStore } from "./types";

export class InMemoryMemoryStore implements MemoryStore {
  private readonly items = new Map<string, MemoryItem>();

  async upsert(input: Omit<MemoryItem, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<MemoryItem> {
    const now = new Date().toISOString();
    const existing = [...this.items.values()].find(
      item => item.company_id === input.company_id &&
        item.memory_type === input.memory_type &&
        item.memory_key === input.memory_key,
    );
    const item: MemoryItem = {
      ...input,
      id: existing?.id ?? input.id ?? randomUUID(),
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    this.items.set(item.id, item);
    return item;
  }

  async search(query: MemoryQuery): Promise<MemoryItem[]> {
    const needle = (query.query ?? "").toLowerCase().trim();
    return [...this.items.values()]
      .filter(item => item.company_id === query.company_id)
      .filter(item => !query.memory_type || item.memory_type === query.memory_type)
      .filter(item => !needle || `${item.memory_key} ${item.content}`.toLowerCase().includes(needle))
      .sort((a,b) => b.importance - a.importance || b.confidence - a.confidence)
      .slice(0, Math.min(Math.max(query.limit ?? 10, 1), 50));
  }

  async get(companyId: string, memoryType: MemoryItem["memory_type"], memoryKey: string): Promise<MemoryItem | null> {
    return [...this.items.values()].find(item =>
      item.company_id === companyId &&
      item.memory_type === memoryType &&
      item.memory_key === memoryKey
    ) ?? null;
  }
}