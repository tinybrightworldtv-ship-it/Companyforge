import {getAnalyticsSummary} from "../../lib/analytics";

export default async function AnalyticsPage(){
 const d=await getAnalyticsSummary(30);
 if(!d)return <main style={{maxWidth:720,margin:"80px auto",padding:24}}><h1>Analytics</h1><p>No company has been created for this account.</p></main>;
 return <main style={{maxWidth:1100,margin:"40px auto",padding:"0 24px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><div><div className="eyebrow">LAST 30 DAYS</div><h1 className="title">Business Analytics</h1><p className="sub">Recorded activity only. No estimated visitors or revenue.</p></div><a href="/">← Command Center</a></div>
  <section className="metrics" style={{marginTop:24}}>
   <div className="card"><div className="sub">Visitors</div><div className="value">{d.visitors.toLocaleString()}</div><div className="meta">{d.uniqueVisitors.toLocaleString()} unique</div></div>
   <div className="card"><div className="sub">Leads</div><div className="value">{d.leads.toLocaleString()}</div></div>
   <div className="card"><div className="sub">Customers</div><div className="value">{d.customers.toLocaleString()}</div><div className="meta">{(d.conversionRate*100).toFixed(1)}% visitor conversion</div></div>
   <div className="card"><div className="sub">Earnings</div><div className="value">{d.currency} {d.earnings.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div></div>
  </section>
  <section className="panel" style={{marginTop:24}}><h2>Acquisition channels</h2>{d.byChannel.length===0?<p className="meta">No acquisition events recorded yet.</p>:d.byChannel.map(row=><div className="row" key={row.channel}><div><b>{row.channel}</b><div className="meta">{row.visitors} visitors · {row.leads} leads · {row.customers} customers</div></div><span className="pill">{row.earnings?`${d.currency} ${row.earnings.toFixed(2)}`:"—"}</span></div>)}</section>
 </main>;
}
