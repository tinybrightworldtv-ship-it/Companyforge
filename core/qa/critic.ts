import type {QACheck,QAReport} from "./types";
export function buildQAReport(input:{websiteBuildId:string;checks:QACheck[];generatedAt?:string}):QAReport{
 const blockingIssues=input.checks.filter(c=>c.status==="fail"||c.status==="blocked").map(c=>c.message);
 return{websiteBuildId:input.websiteBuildId,status:blockingIssues.length?"failed":"passed",checks:input.checks,blockingIssues,generatedAt:input.generatedAt??new Date().toISOString()};
}
