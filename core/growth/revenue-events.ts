export type RevenueEventType="purchase"|"subscription"|"revenue"|"refund"|"chargeback";

export interface RevenueEvent {
  companyId:string;
  eventType:RevenueEventType;
  value:number;
  currency:string;
  source:string;
  externalEventId?:string;
  customerId?:string;
  occurredAt?:string;
  metadata?:Record<string,unknown>;
}

export function validateRevenueEvent(input:unknown):RevenueEvent {
  if(!input || typeof input!=="object") throw new Error("Invalid revenue event");
  const v=input as Record<string,unknown>;
  if(typeof v.companyId!=="string" || !v.companyId) throw new Error("companyId is required");
  if(!["purchase","subscription","revenue","refund","chargeback"].includes(String(v.eventType))) throw new Error("Unsupported revenue event");
  if(typeof v.value!=="number" || !Number.isFinite(v.value)) throw new Error("value must be a finite number");
  if(typeof v.currency!=="string" || !/^[A-Za-z]{3}$/.test(v.currency)) throw new Error("currency must be ISO-like 3 letters");
  if(typeof v.source!=="string" || !v.source) throw new Error("source is required");
  return {
    companyId:v.companyId,eventType:v.eventType as RevenueEventType,value:v.value,currency:v.currency.toUpperCase(),
    source:String(v.source).slice(0,100),externalEventId:typeof v.externalEventId==="string"?v.externalEventId.slice(0,200):undefined,
    customerId:typeof v.customerId==="string"?v.customerId.slice(0,200):undefined,
    occurredAt:typeof v.occurredAt==="string"?v.occurredAt:new Date().toISOString(),
    metadata:v.metadata && typeof v.metadata==="object"?v.metadata as Record<string,unknown>:undefined
  };
}
