import assert from "node:assert/strict";
import {companyForgeAgentCatalog} from "../core/runtime";
const ids=companyForgeAgentCatalog().map(x=>x.id);
assert.ok(ids.includes("ceo"));
assert.ok(ids.includes("builder"));
assert.ok(ids.includes("qa"));
assert.equal(ids.length,12);
console.log("Runtime bootstrap tests passed.");
