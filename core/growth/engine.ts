import type {GrowthExperiment} from "./types";
export function planGrowthExperiment(input:Omit<GrowthExperiment,"status">):GrowthExperiment{return{...input,status:"planned"}}
export function completeGrowthExperiment(e:GrowthExperiment,result:number):GrowthExperiment{return{...e,status:"completed",result}}
