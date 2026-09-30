import assert from "node:assert/strict";
import {prioritizeImprovements,canValidate} from "../core/improvement";
const a={proposalId:"a",companyId:"c",source:"qa" as const,problem:"x",hypothesis:"y",expectedImpact:"z",requiredEvidence:["build"],risk:"high" as const,status:"proposed" as const};
const b={...a,proposalId:"b",risk:"low" as const};
assert.equal(prioritizeImprovements([b,a])[0].proposalId,"a");
assert.equal(canValidate(a,{build:true}),true);
console.log("Improvement tests passed.");
