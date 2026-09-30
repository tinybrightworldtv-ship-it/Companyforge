import type { WebsiteSpec } from "./types";

export type BuildArtifact={path:string;purpose:string;content:string};
export type WebsiteBuildPlan={companyId:string;status:"ready_for_build";framework:"nextjs-app-router";artifacts:BuildArtifact[];dependencies:string[];acceptance:string[]};

export function createBuildPlan(spec:WebsiteSpec):WebsiteBuildPlan{
 const hero=spec.pages[0];
 const nav=spec.pages.map(p=>p.path).join(", ");
 const content=`export default function GeneratedHome(){return <main><header><strong>Company</strong><nav>{[${nav.split(", ").map(x=>JSON.stringify(x)).join(",")}].map((item)=><a key={item} href={item}>{item}</a>)}</nav></header><section><p>Built from the approved CompanyForge specification.</p><h1>${hero?.purpose ?? "Your business"}</h1><a href="#cta">${hero?.primaryCta ?? "Get started"}</a></section><section id="cta"><h2>Ready to take the next step?</h2><p>Replace this generated content with approved company-specific copy before launch.</p></section></main>}`;
 return {companyId:spec.companyId,status:"ready_for_build",framework:"nextjs-app-router",artifacts:[
  {path:"app/page.tsx",purpose:"Initial generated homepage scaffold",content:content},
  {path:"app/globals.css",purpose:"Base visual system placeholder",content:"main{max-width:1200px;margin:auto;padding:32px}nav{display:flex;gap:16px}section{padding:80px 0}"},
  {path:"app/layout.tsx",purpose:"Application shell and metadata",content:"export default function Layout({children}:{children:React.ReactNode}){return <html lang=\"en\"><body>{children}</body></html>}"},
  {path:"README.md",purpose:"Generated project build instructions",content:"# CompanyForge generated site\n\nThis project was generated from a validated WebsiteSpec. Replace placeholders with approved copy/assets before production launch."}
 ],dependencies:["next","react","react-dom"],acceptance:spec.acceptance};
}