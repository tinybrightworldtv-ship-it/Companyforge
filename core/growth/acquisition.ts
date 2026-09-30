import {buildCustomerAcquisitionPlan,type CustomerAcquisitionPlan} from "./distribution";
import {buildTargetProfile,classifyTargetModel,type TargetProfile} from "./targeting";
import {buildTrendOpportunity,type TrendSignal, type TrendOpportunity} from "./trends";
import {AD_PLATFORMS,type AdPlatform} from "./ad-platforms";
export interface AcquisitionBlueprint{target:TargetProfile;plan:CustomerAcquisitionPlan;freeChannels:string[];paidPlatforms:AdPlatform[];trendOpportunities:TrendOpportunity[];attribution:{utmRequired:true;conversionEvents:string[]};}
export function buildAcquisitionBlueprint(input:{businessIdea:string;customerDescription:string;offer:string;destinationUrl:string;includePaid?:boolean;includeLocal?:boolean;trends?:TrendSignal[]}):AcquisitionBlueprint{
 const model=classifyTargetModel({businessIdea:input.businessIdea});
 const target=buildTargetProfile({model,customerDescription:input.customerDescription});
 const plan=buildCustomerAcquisitionPlan({idealCustomer:input.customerDescription,problem:input.businessIdea,offer:input.offer,includePaid:input.includePaid,includeLocal:input.includeLocal});
 return {target,plan,freeChannels:plan.channels.filter(c=>!c.requiresAdBudget).map(c=>c.channel),paidPlatforms:input.includePaid?AD_PLATFORMS.map(p=>p.id):[],trendOpportunities:(input.trends??[]).map(signal=>buildTrendOpportunity({signal,businessCategory:model,targetCustomer:input.customerDescription})),attribution:{utmRequired:true,conversionEvents:["page_view","signup","lead","checkout_start","purchase","subscription","qualified_lead"]}};
}