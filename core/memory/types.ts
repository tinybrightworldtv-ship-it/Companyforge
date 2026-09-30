export type MemoryType =
  | "decision" | "fact" | "customer" | "experiment" | "lesson"
  | "preference" | "metric" | "document" | "instruction";

export interface MemoryItem {
  id: string;
  company_id: string;
  memory_type: MemoryType;
  memory_key: string;
  content: string;
  metadata: Record<string, unknown>;
  source_task_id?: string | null;
  source_agent_id?: string | null;
  confidence: number;
  importance: number;
  created_at?: string;
  updated_at?: string;
}

export interface MemoryQuery {
  company_id: string;
  query?: string;
  memory_type?: MemoryType;
  limit?: number;
}

export interface MemoryStore {
  upsert(item: Omit<MemoryItem, "id" | "created_at" | "updated_at"> & { id?: string }): Promise<MemoryItem>;
  search(query: MemoryQuery): Promise<MemoryItem[]>;
  get(companyId: string, memoryType: MemoryType, memoryKey: string): Promise<MemoryItem | null>;
}