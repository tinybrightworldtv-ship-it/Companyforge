import type {Experiment,MetricPoint} from "./types";
export function createExperiment(input:Omit<Experiment,"status"|"evidence">):Experiment{return{...input,status:"proposed",evidence:[]}}
export function recordMetric(e:Experiment,p:MetricPoint):Experiment{return{...e,evidence:[...e.evidence,p]}}
export function evaluateExperiment(e:Experiment):Experiment{
 const latest=[...e.evidence].sort((a,b)=>a.timestamp.localeCompare(b.timestamp)).at(-1);
 if(!latest)return e;
 return{...e,status:latest.value>=e.target?"validated":"running"};
}
export function recommendNextExperiment(e:Experiment):string|null{
 if(e.status==="validated")return "Scale the validated change and start a follow-up experiment measuring retention or revenue.";
 if(e.status==="running")return "Collect another comparable metric observation before declaring the hypothesis validated.";
 return null;
}
