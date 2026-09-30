import type { ResearchFinding } from "./types";
export interface ResearchSource { title:string; url:string; text:string; observedAt:string; }
const enc=(q:string)=>encodeURIComponent(q.trim());
export async function searchPublicSources(query:string,limit=8):Promise<ResearchSource[]>{
 const now=new Date().toISOString(), out:ResearchSource[]=[];
 const news=await fetch("https://news.google.com/rss/search?q="+enc(query)+"&hl=en-US&gl=US&ceid=US:en",{headers:{"user-agent":"CompanyForgeResearch/0.1"}});
 if(news.ok){const xml=await news.text(); for(const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)){const b=m[1],title=(b.match(/<title>([\s\S]*?)<\/title>/i)?.[1]??"").replace(/<!\[CDATA\[|\]\]>/g,"").trim(),url=(b.match(/<link>([\s\S]*?)<\/link>/i)?.[1]??"").trim(),text=(b.match(/<description>([\s\S]*?)<\/description>/i)?.[1]??"").replace(/<[^>]+>/g," ").replace(/<!\[CDATA\[|\]\]>/g,"").trim();if(title&&url)out.push({title,url,text,observedAt:now});if(out.length>=limit)break;}}
 const wiki=await fetch("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="+enc(query)+"&format=json&utf8=1&srlimit="+Math.min(10,limit),{headers:{"user-agent":"CompanyForgeResearch/0.1"}});
 if(wiki.ok){const data=await wiki.json() as any;for(const x of data.query?.search??[]){out.push({title:x.title,url:"https://en.wikipedia.org/?curid="+x.pageid,text:String(x.snippet??"").replace(/<[^>]+>/g," "),observedAt:now});if(out.length>=limit*2)break;}}
 return out;
}
export const sourcesToEvidence=(sources:ResearchSource[]):ResearchFinding[]=>sources.map(s=>({claim:s.title+(s.text?": "+s.text:""),source:s.title,sourceUrl:s.url,confidence:.65,observedAt:s.observedAt}));
