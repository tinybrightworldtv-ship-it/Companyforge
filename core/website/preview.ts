export type PreviewStatus="queued"|"building"|"passed"|"failed"|"expired";
export type PreviewBuild={websiteBuildId:string;status:PreviewStatus;buildCommand:"npm run build";previewUrl?:string;commitSha?:string;evidence?:Record<string,unknown>;buildLog?:string};
export function queuePreviewBuild(websiteBuildId:string):PreviewBuild{return{websiteBuildId,status:"queued",buildCommand:"npm run build",evidence:{}}}
