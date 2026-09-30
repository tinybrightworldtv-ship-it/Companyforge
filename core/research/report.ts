import type {ResearchFinding,ResearchReport} from "./types";
export function createResearchReport(input:Omit<ResearchReport,"findings"|"gaps">):ResearchReport{return{...input,findings:[],gaps:["No findings have been verified yet."]}}
export function addFinding(r:ResearchReport,f:ResearchFinding):ResearchReport{return{...r,findings:[...r.findings,f],gaps:r.gaps.filter(g=>g!=="No findings have been verified yet.")}}
