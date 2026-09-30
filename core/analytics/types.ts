export type ExperimentStatus="proposed"|"running"|"validated"|"invalidated"|"stopped";
export interface MetricPoint{metric:string;value:number;timestamp:string;source:string}
export interface Experiment{experimentId:string;companyId:string;hypothesis:string;metric:string;baseline:number;target:number;status:ExperimentStatus;evidence:MetricPoint[]}
