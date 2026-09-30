export const PUBLIC_EVENT_TYPES = ["page_view","signup","lead","qualified_lead","checkout_start"] as const;
export type PublicEventType=(typeof PUBLIC_EVENT_TYPES)[number];

export interface PublicAcquisitionEvent {
  companyId:string;
  eventType:PublicEventType;
  channel?:string;
  source?:string;
  medium?:string;
  campaign?:string;
  content?:string;
  visitorId?:string;
  metadata?:Record<string,unknown>;
  occurredAt?:string;
}

export function validatePublicEvent(input:unknown):PublicAcquisitionEvent {
  if(!input || typeof input!=="object") throw new Error("Invalid event");
  const value=input as Record<string,unknown>;
  if(typeof value.companyId!=="string" || !value.companyId) throw new Error("companyId is required");
  if(typeof value.eventType!=="string" || !PUBLIC_EVENT_TYPES.includes(value.eventType as PublicEventType)) throw new Error("Unsupported public event type");
  const text=(key:string,max=200)=>typeof value[key]==="string"?String(value[key]).slice(0,max):undefined;
  return {
    companyId:value.companyId,
    eventType:value.eventType as PublicEventType,
    channel:text("channel")??"website",
    source:text("source"),
    medium:text("medium"),
    campaign:text("campaign"),
    content:text("content"),
    visitorId:text("visitorId",128),
    metadata:value.metadata && typeof value.metadata==="object"?Object.fromEntries(Object.entries(value.metadata as Record<string,unknown>).slice(0,20).map(([k,v])=>[k,String(v).slice(0,500)])):undefined,
    occurredAt:typeof value.occurredAt==="string"?value.occurredAt:new Date().toISOString()
  };
}
