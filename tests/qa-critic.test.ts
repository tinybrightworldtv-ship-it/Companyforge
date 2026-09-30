import assert from "node:assert/strict";
import {buildQAReport} from "../core/qa";
const failed=buildQAReport({websiteBuildId:"b1",checks:[{kind:"page",status:"pass",message:"Page loaded",evidence:{httpStatus:200}},{kind:"console",status:"fail",message:"Console error detected",evidence:{count:1},fix:"Fix runtime error"}]});
assert.equal(failed.status,"failed");
assert.ok(failed.blockingIssues.includes("Console error detected"));
const passed=buildQAReport({websiteBuildId:"b1",checks:[{kind:"page",status:"pass",message:"Page loaded",evidence:{httpStatus:200}}]});
assert.equal(passed.status,"passed");
console.log("QA critic tests passed.");
