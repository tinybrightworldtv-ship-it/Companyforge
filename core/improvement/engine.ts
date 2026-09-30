import type {ImprovementProposal} from "./types";
export function prioritizeImprovements(items:ImprovementProposal[]):ImprovementProposal[]{return [...items].sort((a,b)=>({critical:4,high:3,medium:2,low:1}[b.risk]-({critical:4,high:3,medium:2,low:1}[a.risk])))}
export function canValidate(proposal:ImprovementProposal,evidence:Record<string,unknown>):boolean{return proposal.requiredEvidence.every(key=>evidence[key]!==undefined)}
