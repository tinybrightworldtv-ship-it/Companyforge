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
 const layout='import type { ReactNode } from "react";\n\nexport default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>}';
 const packageJson=JSON.stringify({scripts:{dev:"next dev",build:"next build",start:"next start"},dependencies:{next:"latest",react:"latest","react-dom":"latest"}},null,2);
 return {companyId:spec.companyId,status:"ready_for_build",framework:"nextjs-app-router",artifacts:[
  {path:"app/page.tsx",purpose:"Generated homepage scaffold",content:page},
  {path:"app/globals.css",purpose:"Base visual system",content:"*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px}nav{display:flex;gap:16px;flex-wrap:wrap}section{padding:80px 0}a{color:inherit}"},
  {path:"app/layout.tsx",purpose:"Next.js application shell",content:layout},
  {path:"package.json",purpose:"Generated Next.js runtime dependencies",content:packageJson},
  {path:"tsconfig.json",purpose:"TypeScript configuration",content:JSON.stringify({compilerOptions:{target:"ES2020",lib:["dom","dom.iterable","esnext"],allowJs:false,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:"esnext",moduleResolution:"bundler",resolveJsonModule:true,isolatedModules:true,jsx:"preserve",incremental:true,plugins:[{name:"next"}]},include:["next-env.d.ts","**/*.ts","**/*.tsx",".next/types/**/*.ts"],exclude:["node_modules"]},null,2)},
  {path:"next-env.d.ts",purpose:"Next.js TypeScript declarations",content:"/// <reference types=\"next\" />\n/// <reference types=\"next/image-types/global\" />\n\n// NOTE: This file should not be edited"},
  {path:"README.md",purpose:"Generated project instructions",content:"# CompanyForge generated site\n\nGenerated from a validated WebsiteSpec. Approved copy/assets must be inserted and the project must pass build and QA evidence before deployment."}
 ],dependencies:["next","react","react-dom"],acceptance:spec.acceptance};
}