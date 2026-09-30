export type WebsiteBuildFile={websiteBuildId:string;path:string;purpose?:string;content:string;contentHash?:string;status:"generated"|"validated"|"rejected"|"deployed"};
export interface WebsiteProjectStore{saveFiles(files:WebsiteBuildFile[]):Promise<void>;listFiles(buildId:string):Promise<WebsiteBuildFile[]>}
