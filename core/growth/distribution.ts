export type DistributionChannel =
  | "instagram"|"facebook"|"tiktok"|"youtube"|"linkedin"|"pinterest"|"x"|"threads"
  | "reddit"|"whatsapp"|"telegram"|"google_business_profile"|"bing_places"|"product_hunt"
  | "search"|"directories"|"partnerships"|"email"|"community";

export type DistributionMode="organic"|"paid"|"listing"|"partnership";
export interface CustomerChannel{channel:DistributionChannel;mode:DistributionMode;audienceSignal:string;contentFormats:string[];cta:string;requiresAdBudget:boolean;requiresApproval:boolean;notes?:string;}
export interface CustomerAcquisitionPlan{idealCustomer:string;problem:string;offer:string;channels:CustomerChannel[];weeklyActions:string[];measurement:string[];}

export function buildCustomerAcquisitionPlan(input:{idealCustomer:string;problem:string;offer:string;includePaid?:boolean;includeLocal?:boolean}):CustomerAcquisitionPlan{
 const channels:CustomerChannel[]=[
 {channel:"search",mode:"organic",audienceSignal:"people actively searching for the problem",contentFormats:["SEO pages","how-to articles","comparison pages"],cta:"Visit the offer page",requiresAdBudget:false,requiresApproval:false},
 {channel:"youtube",mode:"organic",audienceSignal:"people researching solutions visually",contentFormats:["Shorts","tutorials","demos","case studies"],cta:"Watch/demo/click",requiresAdBudget:false,requiresApproval:false},
 {channel:"linkedin",mode:"organic",audienceSignal:"professional buyers and decision makers",contentFormats:["posts","carousels","case studies"],cta:"Start a conversation",requiresAdBudget:false,requiresApproval:false},
 {channel:"reddit",mode:"organic",audienceSignal:"communities discussing specific problems",contentFormats:["helpful answers","case-study posts"],cta:"Read the full resource",requiresAdBudget:false,requiresApproval:true,notes:"Only participate where rules allow; no unsolicited spam."},
 {channel:"pinterest",mode:"organic",audienceSignal:"people discovering products, ideas and solutions",contentFormats:["pins","visual guides"],cta:"Open the solution",requiresAdBudget:false,requiresApproval:false},
 {channel:"facebook",mode:"organic",audienceSignal:"interest and community audiences",contentFormats:["posts","reels","groups where permitted"],cta:"Learn more",requiresAdBudget:false,requiresApproval:true,notes:"Respect group/page rules."},
 {channel:"instagram",mode:"organic",audienceSignal:"visual discovery and short-form audiences",contentFormats:["Reels","carousels","stories"],cta:"Learn more",requiresAdBudget:false,requiresApproval:false},
 {channel:"tiktok",mode:"organic",audienceSignal:"short-form problem/solution discovery",contentFormats:["short videos","demos"],cta:"Learn more",requiresAdBudget:false,requiresApproval:false},
 {channel:"x",mode:"organic",audienceSignal:"real-time interest and professional communities",contentFormats:["short insights","threads","product updates"],cta:"Learn more",requiresAdBudget:false,requiresApproval:false},
 {channel:"threads",mode:"organic",audienceSignal:"conversation and interest communities",contentFormats:["short posts","discussion threads"],cta:"Join the conversation",requiresAdBudget:false,requiresApproval:false},
 {channel:"whatsapp",mode:"organic",audienceSignal:"opted-in contacts and customer communities",contentFormats:["status","broadcasts","support conversations"],cta:"Reply/visit",requiresAdBudget:false,requiresApproval:true,notes:"Use only opt-in messaging; no unsolicited bulk messages."},
 {channel:"telegram",mode:"organic",audienceSignal:"opt-in niche communities",contentFormats:["channel posts","community updates"],cta:"Join/visit",requiresAdBudget:false,requiresApproval:true,notes:"Respect community rules."},
 {channel:"directories",mode:"listing",audienceSignal:"buyers browsing business/software directories",contentFormats:["company listing","product profile"],cta:"Visit website",requiresAdBudget:false,requiresApproval:true},
 {channel:"product_hunt",mode:"listing",audienceSignal:"early adopters discovering products",contentFormats:["launch page","maker updates"],cta:"Try the product",requiresAdBudget:false,requiresApproval:true},
 {channel:"partnerships",mode:"partnership",audienceSignal:"adjacent audiences owned by complementary businesses/creators",contentFormats:["referrals","co-marketing","affiliate offers"],cta:"Use referral link",requiresAdBudget:false,requiresApproval:true},
 {channel:"email",mode:"organic",audienceSignal:"consented leads and customers",contentFormats:["newsletters","product updates","nurture sequences"],cta:"Return to offer",requiresAdBudget:false,requiresApproval:true,notes:"Use permission-based email only."},
 {channel:"community",mode:"organic",audienceSignal:"relevant professional and interest communities",contentFormats:["answers","events","resources"],cta:"Read resource",requiresAdBudget:false,requiresApproval:true}
 ];
 if(input.includeLocal){
  channels.push({channel:"google_business_profile",mode:"listing",audienceSignal:"local/service-area searchers",contentFormats:["business profile","photos","updates","offers"],cta:"Call/visit/website",requiresAdBudget:false,requiresApproval:true,notes:"Only eligible businesses should use this."});
  channels.push({channel:"bing_places",mode:"listing",audienceSignal:"local searchers using Bing properties",contentFormats:["business listing","updates"],cta:"Call/visit/website",requiresAdBudget:false,requiresApproval:true});
 }
 if(input.includePaid) channels.push({channel:"facebook",mode:"paid",audienceSignal:"targeted Meta audiences",contentFormats:["Reels ads","image ads","video ads"],cta:"Landing page conversion",requiresAdBudget:true,requiresApproval:true,notes:"Paid Meta distribution requires a real ad account and provider evidence."});
 return {idealCustomer:input.idealCustomer,problem:input.problem,offer:input.offer,channels,weeklyActions:["Create platform-native content from one core offer","Test free channels before scaling spend","Measure visits, leads, conversions and acquisition cost by channel","Stop or revise channels that produce weak evidence"],measurement:["UTM/source attribution","landing-page conversion rate","qualified leads","sales","cost per acquisition","return on ad spend when paid"]};
}