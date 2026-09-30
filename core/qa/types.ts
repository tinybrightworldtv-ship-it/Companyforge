export type QACheckStatus="pass"|"fail"|"blocked";
export type QACheckKind="page"|"responsive"|"console"|"links"|"cta"|"accessibility"|"seo"|"assets"|"three_d"|"performance";
export interface QACheck{kind:QACheckKind;status:QACheckStatus;message:string;evidence:Record<string,unknown>;fix?:string}
export interface QAReport{websiteBuildId:string;status:"passed"|"failed"|"blocked";checks:QACheck[];blockingIssues:string[];generatedAt:string}
