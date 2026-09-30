import assert from "node:assert/strict";
import {buildCustomerAcquisitionPlan} from "../core/growth/distribution";
const plan=buildCustomerAcquisitionPlan({idealCustomer:"SMB owner",problem:"missed leads",offer:"automated follow-up",includePaid:true});
assert.ok(plan.channels.some(c=>c.channel==="instagram"&&c.mode==="organic"));
assert.ok(plan.channels.some(c=>c.mode==="paid"&&c.requiresAdBudget));
assert.ok(plan.channels.some(c=>c.channel==="search"&&c.requiresAdBudget===false));
console.log("Growth distribution tests passed.");
