import assert from "node:assert/strict";
import { createWebsiteSpec } from "../core/website/spec";
const s=createWebsiteSpec({companyId:"c",name:"Demo",description:"automates invoices",targetCustomer:"small businesses",desiredOutcome:"save time",siteType:"saas",include3D:true});
assert.ok(s.pages.length>3);
assert.ok(s.assets.some(a=>a.type==="3d_scene"));
assert.ok(s.acceptance.some(x=>x.includes("deployment")));
console.log("Website spec tests passed.");
