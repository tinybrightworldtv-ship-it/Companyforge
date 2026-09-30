export type IncidentSeverity="info"|"warning"|"critical";
export interface ServiceSignal{service:string;status:"healthy"|"degraded"|"down";latencyMs?:number;timestamp:string}
export interface Incident{incidentId:string;companyId:string;severity:IncidentSeverity;service:string;summary:string;createdAt:string;status:"open"|"resolved";recommendedAction:string}
