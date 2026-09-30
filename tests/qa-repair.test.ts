import assert from "node:assert/strict";
import {buildQAReport} from "../core/qa";
import {createRepairTasks} from "../core/qa/repair";
const r=buildQAReport({websiteBuildId:"b1",checks:[{kind:"links",status:"fail",message:"Broken link",evidence:{href:"/pricing"},fix:"Repair pricing route"}]});
const tasks=createRepairTasks(r);
assert.equal(tasks[0].objective,"Repair pricing route");
assert.ok(tasks[0].expectedOutcome.includes("passes"));
console.log("QA repair tests passed.");
