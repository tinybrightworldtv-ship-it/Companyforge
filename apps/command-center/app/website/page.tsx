import { createClient } from "../../lib/supabase/server";

export default async function WebsitePage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return null;
  const { data: company } = await supabase.from("companies").select("id,name").eq("owner_id",userId).order("created_at",{ascending:true}).limit(1).maybeSingle();
  if (!company) return <main className="empty"><h1>No company yet</h1><p>Create a company to initialize its website system.</p></main>;
  const { data: website } = await supabase.from("website_builds").select("id,status,site_type,pages,features,three_d_plan").eq("company_id",company.id).order("created_at",{ascending:false}).limit(1).maybeSingle();
  if (!website) return <main className="empty"><h1>Website workspace</h1><p>No website build has been initialized.</p></main>;
  return <main className="website-page"><div className="eyebrow">WEBSITE ENGINE</div><h1>{company.name}</h1><p className="sub">Website build status: <b>{website.status}</b></p><div className="website-grid"><section className="panel"><h2>Pages</h2>{(website.pages as string[]).map(x=><div className="row" key={x}><b>{x}</b><span className="pill">planned</span></div>)}</section><section className="panel"><h2>Visual & 3D</h2><div className="row"><div><b>3D system</b><div className="meta">Purposeful, performance-conscious 3D planning</div></div><span className="pill">{(website.three_d_plan as {enabled?:boolean}).enabled ? "enabled" : "off"}</span></div><div className="row"><div><b>Images</b><div className="meta">Hero, brand and supporting visual assets</div></div><span className="pill">planned</span></div></section></div></main>;
}
