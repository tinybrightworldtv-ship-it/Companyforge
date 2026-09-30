export type ImprovementSource="qa"|"analytics"|"customer"|"finance"|"operations";
export interface ImprovementProposal{proposalId:string;companyId:string;source:ImprovementSource;problem:string;hypothesis:string;expectedImpact:string;requiredEvidence:string[];risk:"low"|"medium"|"high"|"critical";status:"proposed"|"approved"|"rejected"|"executing"|"validated"|"failed";}
