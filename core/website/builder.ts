import type { WebsiteSpec } from "./types";

export type BuildArtifact={path:string;purpose:string;content:string};
export type WebsiteBuildPlan={companyId:string;status:"ready_for_build";framework:"nextjs-app-router";artifacts:BuildArtifact[];dependencies:string[];acceptance:string[]};

export function createBuildPlan(spec:WebsiteSpec):WebsiteBuildPlan{
 const hero=spec.pages[0];
 const nav=spec.pages.map(p=>p.path);
 const navItems=nav.map(path=>JSON.stringify(path)).join(",");
 const title=JSON.stringify(hero?.purpose ?? "Your business");
 const cta=JSON.stringify(hero?.primaryCta ?? "Get started");
 const page=`export default function GeneratedHome(){return <main><header><strong>CompanyForge Site</strong><nav>{[${navItems}].map((item)=><a key={item} href={item}>{item}</a>)}</nav></header><section><p>Built from the approved CompanyForge specification.</p><h1>${title}</h1><a href="#cta">${cta}</a></section><section id="cta"><h2>Ready to take the next step?</h2><p>Company-specific copy and approved assets are inserted before launch.</p></section></main>}`;
 const analytics=`"use client";\nimport {useEffect} from "react";\nconst COMPANY_ID=${JSON.stringify(spec.companyId)};\nfunction visitorId(){const key="companyforge_visitor_id";let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id)}return id}\nexport default function Analytics(){useEffect(()=>{const params=new URLSearchParams(location.search);const payload={companyId:COMPANY_ID,eventType:"page_view",channel:"website",source:params.get("utm_source")??(document.referrer?new URL(document.referrer).hostname:"direct"),medium:params.get("utm_medium")??"referral",campaign:params.get("utm_campaign")??undefined,content:params.get("utm_content")??undefined,visitorId:visitorId(),metadata:{path:location.pathname}};navigator.sendBeacon?.("/api/events/collect",new Blob([JSON.stringify(payload)],{type:"application/json"}))??fetch("/api/events/collect",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),keepalive:true})},[]);return null}`;\n const layout='import type { ReactNode } from "react";\\nimport Analytics from "./analytics";\\n\\nexport default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body><Analytics />{children}</body></html>}';
 const packageJson=JSON.stringify({scripts:{dev:"next dev",build:"next build",start:"next start"},dependencies:{next:"latest",react:"latest","react-dom":"latest"}},null,2);
 return {companyId:spec.companyId,status:"ready_for_build",framework:"nextjs-app-router",artifacts:[
  {path:"app/page.tsx",purpose:"Generated homepage scaffold",content:page},
  {path:"app/globals.css",purpose:"Base visual system",content:"*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px}nav{display:flex;gap:16px;flex-wrap:wrap}section{padding:80px 0}a{color:inherit}"},
  {path:"app/layout.tsx",purpose:"Next.js application shell with privacy-safe page-view collection",content:layout},
  {path:"app/analytics.tsx",purpose:"First-party visitor attribution and page-view collection",content:analytics},
  {path:"package.json",purpose:"Generated Next.js runtime dependencies",content:packageJson},
  {path:"tsconfig.json",purpose:"TypeScript configuration",content:JSON.stringify({compilerOptions:{target:"ES2020",lib:["dom","dom.iterable","esnext"],allowJs:false,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:"esnext",moduleResolution:"bundler",resolveJsonModule:true,isolatedModules:true,jsx:"preserve",incremental:true,plugins:[{name:"next"}]},include:["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],exclude:["node_modules"]},null,2)},
  {path:"next-env.d.ts",purpose:"Next.js TypeScript declarations",content:"/// <reference types=\"next\" />\n/// <reference types=\"next/image-types/global\" />\n\n// NOTE: This file should not be edited"},
  {path:"README.md",purpose:"Generated project instructions",content:"# CompanyForge generated site\n\nGenerated from a validated WebsiteSpec. Approved copy/assets must be inserted and the project must pass build and QA evidence before deployment."}
 ],dependencies:["next","react","react-dom"],acceptance:spec.acceptance};
}