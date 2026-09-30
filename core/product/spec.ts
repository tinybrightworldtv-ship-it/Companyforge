import type {ProductSpec} from "./types";
export function createProductSpec(input:Omit<ProductSpec,"userStories"|"acceptanceCriteria">):ProductSpec{return{...input,userStories:[],acceptanceCriteria:[]}}
export function addAcceptanceCriteria(s:ProductSpec,...criteria:string[]):ProductSpec{return{...s,acceptanceCriteria:[...s.acceptanceCriteria,...criteria]}}
