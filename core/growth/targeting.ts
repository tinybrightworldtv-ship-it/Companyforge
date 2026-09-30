export type BusinessTargetModel =
  | "consumer_b2c" | "direct_to_consumer" | "business_b2b" | "enterprise"
  | "local_service" | "marketplace" | "creator_media" | "developer_technical"
  | "education" | "health_wellness" | "finance" | "nonprofit_public";

export type TargetDimension =
  | "geography" | "demographics" | "firmographics" | "job_role" | "industry"
  | "company_size" | "income_or_budget" | "interests" | "behaviors"
  | "pain_points" | "use_case" | "search_intent" | "purchase_intent"
  | "lifecycle" | "technology_stack" | "community" | "creator_affinity" | "language";

export interface TargetProfile {
  model: BusinessTargetModel;
  primaryDimensions: TargetDimension[];
  buyerRoles: string[];
  audienceHypotheses: string[];
  exclusions: string[];
}

export function classifyTargetModel(input:{businessIdea:string;siteType?:string}):BusinessTargetModel {
  const text=(input.businessIdea+" "+(input.siteType??"")).toLowerCase();
  if(/enterprise|corporate|large compan|procurement|fortune 500/.test(text)) return "enterprise";
  if(/developer tool|devtool|developer platform|sdk|api for developers|coding tool|software development/.test(text)) return "developer_technical";
  if(/local|plumber|salon|restaurant|clinic|dentist|repair|cleaning|barber|roofing/.test(text)) return "local_service";
  if(/course|school|tutor|training|education|learning platform/.test(text)) return "education";
  if(/health|fitness|wellness|therapy|nutrition/.test(text)) return "health_wellness";
  if(/finance|accounting|insurance|banking|invest|fintech/.test(text)) return "finance";
  if(/marketplace|two-sided|buyers and sellers|book a provider/.test(text)) return "marketplace";
  if(/creator|influencer|media|newsletter|podcast/.test(text)) return "creator_media";
  if(/nonprofit|charity|ngo|public service/.test(text)) return "nonprofit_public";
  if(/b2b|business software|software for businesses|saas for businesses|smb software|business platform|agency|professional service/.test(text)) return "business_b2b";
  if(/saas|software|web app|mobile app|app platform/.test(text)) return "business_b2b";
  if(/shop|store|ecommerce|product|consumer|fashion|beauty|home goods/.test(text)) return "direct_to_consumer";
  return "consumer_b2c";
}

export function buildTargetProfile(input:{model:BusinessTargetModel;customerDescription:string}):TargetProfile {
  const map:Record<BusinessTargetModel,TargetDimension[]>={
    consumer_b2c:["pain_points","interests","behaviors","geography","demographics","purchase_intent"],
    direct_to_consumer:["purchase_intent","interests","behaviors","geography","demographics","search_intent"],
    business_b2b:["industry","company_size","job_role","pain_points","income_or_budget","search_intent"],
    enterprise:["industry","company_size","job_role","technology_stack","income_or_budget","pain_points"],
    local_service:["geography","pain_points","search_intent","purchase_intent","lifecycle"],
    marketplace:["use_case","geography","purchase_intent","community","behaviors"],
    creator_media:["interests","creator_affinity","community","language","geography"],
    developer_technical:["technology_stack","job_role","community","search_intent","use_case"],
    education:["use_case","lifecycle","demographics","geography","search_intent"],
    health_wellness:["use_case","lifecycle","geography","interests","purchase_intent"],
    finance:["income_or_budget","lifecycle","use_case","geography","purchase_intent"],
    nonprofit_public:["geography","lifecycle","use_case","language","community"]
  };
  const b2b=input.model==="business_b2b"||input.model==="enterprise";
  return {
    model:input.model,
    primaryDimensions:map[input.model],
    buyerRoles:b2b?["economic buyer","decision maker","end user","influencer"]:["end user","buyer","influencer"],
    audienceHypotheses:[`People matching: ${input.customerDescription}`],
    exclusions:[]
  };
}
