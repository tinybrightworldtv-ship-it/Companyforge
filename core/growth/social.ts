import type {DistributionChannel} from "./distribution";

export interface SocialPostDraft {
  channel: Extract<DistributionChannel,"instagram"|"facebook"|"tiktok"|"youtube"|"linkedin"|"pinterest"|"x">;
  hook: string;
  body: string;
  cta: string;
  destinationUrl: string;
  mediaBrief: string;
  tracking: Record<string,string>;
  approvalRequired: boolean;
}

export function createSocialPostDraft(input:{
  channel: SocialPostDraft["channel"];
  offer: string;
  audience: string;
  destinationUrl: string;
  campaignId: string;
}): SocialPostDraft {
  const names:Record<SocialPostDraft["channel"],string>={
    instagram:"Visual-first hook and concise caption",
    facebook:"Problem/benefit framing with conversational context",
    tiktok:"Fast problem → demonstration → payoff",
    youtube:"Searchable title and useful explanation",
    linkedin:"Business outcome and proof-oriented framing",
    pinterest:"Searchable idea title and visual promise",
    x:"Short insight with a clear curiosity hook"
  };
  return {
    channel:input.channel,
    hook:names[input.channel]+": "+input.offer,
    body:"Help "+input.audience+" understand the problem, the outcome and why this offer is relevant.",
    cta:"Learn more",
    destinationUrl:input.destinationUrl,
    mediaBrief:"Create an original platform-native visual/video showing the problem and the promised outcome. Do not imply unsupported results.",
    tracking:{utm_source:input.channel,utm_medium:"organic_social",utm_campaign:input.campaignId},
    approvalRequired:input.channel==="facebook"
  };
}
