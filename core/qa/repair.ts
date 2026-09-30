import type {QAReport} from "./types";
export type RepairTask={taskId:string;objective:string;priority:"high"|"critical";inputs:Record<string,unknown>;expectedOutcome:string};
export function createRepairTasks(report:QAReport):RepairTask[]{return report.checks.filter(c=>c.status!=="pass").map((c,i)=>({taskId:"qa-repair-"+i,objective:c.fix??"Resolve QA failure: "+c.message,priority:c.kind==="console"||c.kind==="page"?"critical":"high",inputs:{qaCheck:c.kind,evidence:c.evidence,message:c.message},expectedOutcome:"The failed QA check passes with new evidence."}))}
