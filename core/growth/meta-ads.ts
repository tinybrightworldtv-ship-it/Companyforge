export interface MetaAdCampaignPlan {
  campaignId:string;
  objective:"traffic"|"leads"|"sales"|"awareness";
  audienceHypothesis:string;
  placements:string[];
  creatives:string[];
  dailyBudget:number;
  currency:string;
  destinationUrl:string;
  approvalRequired:true;
  status:"planned"|"approved"|"submitted"|"active"|"completed"|"failed";
  evidence?:Record<string,unknown>;
}

export function planMetaAdCampaign(input:Omit<MetaAdCampaignPlan,"approvalRequired"|"status">):MetaAdCampaignPlan {
  return {...input,approvalRequired:true,status:"planned"};
}

export function markMetaAdSubmitted(
  plan:MetaAdCampaignPlan,
  evidence:Record<string,unknown>
):MetaAdCampaignPlan {
  return {...plan,status:"submitted",evidence};
}
