export type TrendSource="google_trends"|"social_trends"|"search_intent"|"marketplace_signal"|"news_signal"|"internal_performance";

export interface TrendSignal {
  topic:string;
  source:TrendSource;
  geography?:string;
  category?:string;
  direction:"rising"|"stable"|"falling";
  evidence:string[];
  observedAt:string;
  confidence:number;
}

export interface TrendOpportunity {
  signal:TrendSignal;
  relevanceToBusiness:string;
  contentAngles:string[];
  productAngles:string[];
  acquisitionAngles:string[];
  caution?:string;
}

export function buildTrendOpportunity(input:{
  signal:TrendSignal;
  businessCategory:string;
  targetCustomer:string;
}):TrendOpportunity {
  return {
    signal:input.signal,
    relevanceToBusiness:`Assess how "${input.signal.topic}" intersects with ${input.businessCategory} for ${input.targetCustomer}.`,
    contentAngles:["educational explainer","problem/solution content","trend-response short video"],
    productAngles:["feature or offer adaptation","bundle/package opportunity","new use case"],
    acquisitionAngles:["trend-keyword landing page","platform-native social content","search-intent experiment"],
    caution:"A spike is not proof of durable demand. Validate commercial intent and conversion evidence before scaling."
  };
}
