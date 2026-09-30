import {validatePublicEvent} from "../core/growth/event-ingestion";
import {validateRevenueEvent} from "../core/growth/revenue-events";

const e=validatePublicEvent({companyId:"c",eventType:"page_view",visitorId:"v",source:"google",medium:"organic"});
if(e.eventType!=="page_view"||e.source!=="google")throw new Error("public event validation failed");
let failed=false;try{validatePublicEvent({companyId:"c",eventType:"purchase"});}catch{failed=true}
if(!failed)throw new Error("public revenue event should be rejected");
const r=validateRevenueEvent({companyId:"c",eventType:"purchase",value:25,currency:"usd",source:"stripe"});
if(r.currency!=="USD"||r.value!==25)throw new Error("revenue event validation failed");
console.log("event ingestion tests passed");
