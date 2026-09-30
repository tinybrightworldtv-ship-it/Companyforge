export type AdPlatform = "meta"|"google_ads"|"tiktok_ads"|"linkedin_ads"|"pinterest_ads"|"microsoft_ads"|"reddit_ads"|"x_ads"|"snap_ads";
export interface AdPlatformDefinition { id:AdPlatform; name:string; surfaces:string[]; supports:["paid"]; approvalRequired:true; credentialEnv:string[]; status:"credential_required"; }
export const AD_PLATFORMS:AdPlatformDefinition[]=[
{id:"meta",name:"Meta Ads",surfaces:["Facebook","Instagram","Messenger","Audience Network"],supports:["paid"],approvalRequired:true,credentialEnv:["META_ACCESS_TOKEN","META_AD_ACCOUNT_ID"],status:"credential_required"},
{id:"google_ads",name:"Google Ads",surfaces:["Google Search","Display","YouTube","Discover","Maps"],supports:["paid"],approvalRequired:true,credentialEnv:["GOOGLE_ADS_DEVELOPER_TOKEN","GOOGLE_ADS_CUSTOMER_ID"],status:"credential_required"},
{id:"tiktok_ads",name:"TikTok Ads",surfaces:["TikTok"],supports:["paid"],approvalRequired:true,credentialEnv:["TIKTOK_ACCESS_TOKEN"],status:"credential_required"},
{id:"linkedin_ads",name:"LinkedIn Ads",surfaces:["LinkedIn"],supports:["paid"],approvalRequired:true,credentialEnv:["LINKEDIN_ACCESS_TOKEN"],status:"credential_required"},
{id:"pinterest_ads",name:"Pinterest Ads",surfaces:["Pinterest"],supports:["paid"],approvalRequired:true,credentialEnv:["PINTEREST_ACCESS_TOKEN"],status:"credential_required"},
{id:"microsoft_ads",name:"Microsoft Advertising",surfaces:["Bing"],supports:["paid"],approvalRequired:true,credentialEnv:["MICROSOFT_ADS_TOKEN"],status:"credential_required"},
{id:"reddit_ads",name:"Reddit Ads",surfaces:["Reddit"],supports:["paid"],approvalRequired:true,credentialEnv:["REDDIT_ADS_TOKEN"],status:"credential_required"},
{id:"x_ads",name:"X Ads",surfaces:["X"],supports:["paid"],approvalRequired:true,credentialEnv:["X_ADS_TOKEN"],status:"credential_required"},
{id:"snap_ads",name:"Snap Ads",surfaces:["Snapchat"],supports:["paid"],approvalRequired:true,credentialEnv:["SNAP_ADS_TOKEN"],status:"credential_required"}
];
export function getAdPlatform(id:AdPlatform){return AD_PLATFORMS.find(p=>p.id===id);}
