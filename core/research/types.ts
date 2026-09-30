export interface ResearchFinding{claim:string;source:string;sourceUrl?:string;confidence:number;observedAt:string}
export interface ResearchReport{query:string;market:string;findings:ResearchFinding[];gaps:string[]}
