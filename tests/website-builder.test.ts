import assert from "node:assert/strict";
import {createBuildPlan} from "../core/website/builder";
import {createWebsiteSpec} from "../core/website/spec";
const s=createWebsiteSpec({companyId:"c",name:"Demo",description:"automation",targetCustomer:"teams",desiredOutcome:"growth",siteType:"saas",include3D:true});
const p=createBuildPlan(s);
assert.equal(p.framework,"nextjs-app-router");
assert.ok(p.artifacts.some(a=>a.path==="app/page.tsx"));
assert.ok(p.acceptance.length>0);
console.log("Website builder tests passed.");
