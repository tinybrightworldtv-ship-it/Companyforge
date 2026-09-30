export type BusinessTargetModel =
  | "consumer_b2c"
  | "direct_to_consumer"
  | "business_b2b"
  | "enterprise"
  | "local_service"
  | "marketplace"
  | "creator_media"
  | "developer_technical"
  | "education"
  | "health_wellness"
  | "finance"
  | "nonprofit_public";

export type TargetDimension =
  | "geography"
  | "demographics"
  | "firmographics"
  | "job_role"
  | "industry"
  | "company_size"
  | "income_or_budget"
  | "interests"
  | "behaviors"
  | "pain_points"
  | "use_case"
  | "search_intent"
  | "purchase_intent"
  | "lifecycle"
  | "technology_stack"
  | "community"
  | "creator_affinity"
  | "language";

export interface TargetProfile {
  model:BusinessTargetModel;
  primaryDimensions:TargetDimension[];
  buyerRoles:string[];
  audienceHypotheses:string[];
  exclusions:string[];
}

export function classifyTargetModel(input:{businessIdea:string;siteType?:string}):BusinessTargetModel {
  const text=(input.businessIdea+" "+(input.siteType??"")).toLowerCase();
  if(/enterprise|corporate|large compan|procurement/.test(text)) return "enterprise";
  if(/saas|software|api|developer|devtool/.test(text)) return "developer_technical";
  if(/local|plumber|salon|restaurant|clinic|dentist|repair|cleaning/.test(text)) return "local_service";
  if(/course|school|tutor|training|education/.test(text)) return "education";
  if(/health|fitness|wellness|therapy/.test(text)) return "health_wellness";
  if(/finance|accounting|insurance|banking|invest/.test(text)) return "finance";
  if(/marketplace|two-sided|buyers and sellers/.test(text)) return "marketplace";
  if(/creator|influencer|media|newsletter|podcast/.test(text)) return "creator_media";
  if(/nonprofit|charity|ngo|public service/.test(text)) return "nonprofit_public";
  if(/shop|store|ecommerce|product|consumer/.test(text)) return "direct_to_consumer";
  if(/business|b2b|agency|professional service/.test(text)) return "business_b2b";
  return "consumer_b2c";
}

export function buildTargetProfile(input:{model:BusinessTargetModel;customerDescription:string}):TargetProfile {
  const map:Record<BusinessTargetModel,TargetProfile["primaryDimensions"]>={
    consumer_b2c:["pain_points","interests","behaviors","geography","demographics","purchase_intent"],
    direct_to_consumer:["purchase_intent","interests","behaviors","geography","demographics","search_intent"],
    business_b2b:["industry","company_size","job_role","pain_points","budget","search_intent"] as TargetDimension[],
    enterprise:["industry","company_size","job_role","technology_stack","budget","pain_points"],
    local_service:["geography","pain_points","search_intent","purchase_intent","lifecycle"],
    marketplace:["use_case","geography","purchase_intent","community","behaviors"],
    creator_media:["interests","creator_affinity","community","language","geography"],
    developer_technical:["technology_stack","job_role","community","search_intent","use_case"],
    education:["use_case","lifecycle","demographics","geography","search_intent"],
    health_wellness:["use_case","lifecycle","geography","interests","purchase_intent"],
    finance:["income_or_budget","lifecycle","use_case","geography","purchase_intent"],
    nonprofit_public:["geography","lifecycle","use_case","language","community"]
  };
  return {
    model:input.model,
    primaryDimensions:map[input.model],
    buyerRoles:input.model==="business_b2b"||input.model==="enterprise"?["economic buyer","decision maker","end user","influencer"]:["end user","buyer","influencer"],
    audienceHypotheses:[`People matching: ${input.customerDescription}`],
    exclusions:[]
  };
}
