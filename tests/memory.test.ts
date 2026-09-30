import { strict as assert } from "node:assert";
import { InMemoryMemoryStore } from "../core/memory";

async function main() {
  const store = new InMemoryMemoryStore();

  await store.upsert({
    company_id: "company-1",
    memory_type: "decision",
    memory_key: "positioning",
    content: "Serve small businesses first.",
    metadata: { source: "strategy" },
    source_agent_id: "strategy",
    confidence: 0.9,
    importance: 90,
  });

  await store.upsert({
    company_id: "company-2",
    memory_type: "decision",
    memory_key: "positioning",
    content: "Other company memory.",
    metadata: {},
    confidence: 0.9,
    importance: 90,
  });

  const found = await store.search({ company_id: "company-1", query: "small businesses" });
  assert.equal(found.length, 1);
  assert.equal(found[0].memory_key, "positioning");

  const exact = await store.get("company-1", "decision", "positioning");
  assert.equal(exact?.content, "Serve small businesses first.");

  const isolated = await store.search({ company_id: "company-1" });
  assert.equal(isolated.length, 1);

  console.log("Company memory tests passed.");
}

main().catch(error => { console.error(error); process.exit(1); });