import assert from "node:assert/strict";
import {buildTrendOpportunity} from "../core/growth/trends";
import {classifyTargetModel,buildTargetProfile} from "../core/growth/targeting";
import {AD_PLATFORMS} from "../core/growth/ad-platforms";
import {buildAcquisitionBlueprint} from "../core/growth/acquisition";
import {buildUtm,acquisitionFunnel} from "../core/growth/attribution";
assert.equal(classifyTargetModel({businessIdea:"AI SaaS for small businesses"}),"business_b2b");
assert.equal(classifyTargetModel({businessIdea:"AI SDK for developers"}),"developer_technical");
assert.equal(classifyTargetModel({businessIdea:"enterprise procurement automation"}),"enterprise");
const profile=buildTargetProfile({model:"business_b2b",customerDescription:"small agencies with missed leads"});
assert.ok(profile.primaryDimensions.includes("industry"));
assert.ok(profile.primaryDimensions.includes("income_or_budget"));
const opportunity=buildTrendOpportunity({businessCategory:"lead automation",targetCustomer:"small agencies",signal:{topic:"lead follow-up",source:"google_trends",direction:"rising",evidence:["search interest rising"],observedAt:new Date().toISOString(),confidence:.8}});
assert.ok(opportunity.acquisitionAngles.length>0);
const blueprint=buildAcquisitionBlueprint({businessIdea:"AI SaaS for small businesses",customerDescription:"small agencies",offer:"automated lead follow-up",destinationUrl:"landing-page",includePaid:true});
assert.equal(blueprint.target.model,"business_b2b");
assert.ok(blueprint.freeChannels.includes("search"));
assert.ok(blueprint.paidPlatforms.includes("meta"));
assert.ok(blueprint.paidPlatforms.includes("google_ads"));
assert.ok(blueprint.attribution.conversionEvents.includes("purchase"));
assert.equal(AD_PLATFORMS.length,9);
const utm=buildUtm({source:"instagram",medium:"organic_social",campaign:"launch",content:"reel-1"});
assert.equal(utm.utm_source,"instagram");
const funnel=acquisitionFunnel([
{companyId:"c",channel:"instagram",eventType:"page_view",occurredAt:new Date().toISOString()},
{companyId:"c",channel:"instagram",eventType:"lead",occurredAt:new Date().toISOString()},
{companyId:"c",channel:"instagram",eventType:"purchase",occurredAt:new Date().toISOString()}
]);
assert.equal(funnel.visitToLeadRate,1);
assert.equal(funnel.visitToPurchaseRate,1);
console.log("Growth acquisition tests passed.");
