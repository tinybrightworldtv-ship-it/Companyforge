import assert from "node:assert/strict";
import {createSocialPostDraft} from "../core/growth/social";
import {planMetaAdCampaign,markMetaAdSubmitted} from "../core/growth/meta-ads";

const post=createSocialPostDraft({channel:"instagram",offer:"automated lead follow-up",audience:"service businesses",destinationUrl:"https://example.com",campaignId:"c1"});
assert.equal(post.tracking.utm_medium,"organic_social");
assert.equal(post.approvalRequired,false);

const ad=planMetaAdCampaign({campaignId:"m1",objective:"leads",audienceHypothesis:"owners with missed leads",placements:["facebook","instagram","reels"],creatives:["creative-a"],dailyBudget:10,currency:"USD",destinationUrl:"https://example.com"});
assert.equal(ad.approvalRequired,true);
assert.equal(markMetaAdSubmitted(ad,{provider:"meta",campaign_id:"m1"}).status,"submitted");
console.log("Social and Meta ad contracts passed.");
