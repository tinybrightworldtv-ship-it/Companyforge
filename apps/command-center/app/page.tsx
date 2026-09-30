import { getDashboardSummary } from "../lib/dashboard";

const Metric=({label,value,detail}:{label:string;value:number|string;detail?:string})=><div className="ceo-metric"><div>{label}</div><strong>{value}</strong>{detail&&<small>{detail}</small>}</div>;

export default async function Home(){
 const d=await getDashboardSummary();
 if(!d)return <main className="ceo-empty"><div className="ceo-logo">C</div><div className="eyebrow">COMPANYFORGE</div><h1>Your company starts here.</h1><p>Give CompanyForge an idea and your AI workforce can research, plan, build and operate it.</p><a className="ceo-primary" href="/companies/new">Create your company →</a></main>;
 const m=d.metrics;
 const taskCount=d.recentTasks.length;
 const active=d.runningTasks>0;
 const phases=[
  ["01","Understand","Company goal, customer and constraints"],
  ["02","Research","Market, competitors and customer evidence"],
  ["03","Strategize","Business model, positioning and execution plan"],
  ["04","Build","Brand, website, product and infrastructure"],
  ["05","Launch","Distribution, acquisition and measurement"],
  ["06","Operate","Customers, revenue, experiments and improvement"]
 ];
 return <div className="ceo-shell">
  <aside className="ceo-sidebar">
   <div className="ceo-brand"><span className="ceo-logo small">C</span><b>CompanyForge</b></div>
   <div className="company-switcher"><small>COMPANY</small><strong>{d.companyName}</strong><span>● {d.status}</span></div>
   <nav><a className="nav-selected" href="/">⌂ Command Center</a><a href="/website">◈ Website</a><a href="/analytics">⌁ Analytics</a><a href="/approvals">✓ Approvals {d.pendingApprovals>0&&<em>{d.pendingApprovals}</em>}</a><a href="/companies/new">＋ New company</a></nav>
   <div className="sidebar-bottom"><small>AI CEO</small><span>{d.autonomy} mode</span><a href="/settings">Settings →</a></div>
  </aside>
  <main className="ceo-main">
   <header className="ceo-header"><div><div className="eyebrow">AI CEO / COMMAND CENTER</div><h1>{d.companyName}</h1><p>{d.goal}</p></div><div className={active?"live-dot live":"live-dot"}>● {active?"Working":"Standing by"}</div></header>
   <section className="ceo-hero">
    <div><span className="ceo-kicker">YOUR AI CEO</span><h2>{active?"CompanyForge is working on your company.":"Your company is ready for its next decision."}</h2><p>{active?"Specialist agents are executing the current task. Results and evidence will appear here as they are recorded.":"CompanyForge coordinates research, strategy, building, growth and operations from one persistent company memory."}</p></div>
    <div className="ceo-actions"><a href="/website">Open website engine</a><a href="/approvals">Review approvals</a></div>
   </section>
   <section className="ceo-metrics"><Metric label="Visitors" value={m.visitors.toLocaleString()} detail={m.uniqueVisitors.toLocaleString()+" unique"}/><Metric label="Leads" value={m.leads}/><Metric label="Customers" value={m.customers}/><Metric label="Earnings" value={m.currency+" "+m.earnings.toFixed(2)}/><Metric label="Agents" value={d.activeAgents}/><Metric label="Tasks running" value={d.runningTasks}/></section>
   <section className="ceo-grid">
    <div className="ceo-panel wide"><div className="panel-heading"><div><span className="ceo-kicker">COMPANY JOURNEY</span><h3>From idea to operating company</h3></div><span className="recorded">Persistent workflow</span></div><div className="journey">{phases.map(([n,title,desc],i)=><div className={"journey-step "+(i===0?"current":"")} key={n}><span>{n}</span><div><b>{title}</b><small>{desc}</small></div></div>)}</div></div>
    <div className="ceo-panel"><div className="panel-heading"><div><span className="ceo-kicker">AI WORKFORCE</span><h3>What is happening</h3></div></div>{taskCount?d.recentTasks.slice(0,5).map(t=><div className="activity" key={t.id}><span className={"activity-dot "+t.status}/><div><b>{t.objective}</b><small>{t.agent} · {t.status.replace("_"," ")}</small></div></div>):<div className="empty-activity"><b>No execution activity yet</b><p>Your first CEO task will appear here.</p></div>}</div>
    <div className="ceo-panel"><div className="panel-heading"><div><span className="ceo-kicker">COMPANY MEMORY</span><h3>North star</h3></div><a href="/memory">View →</a></div><div className="memory-block"><small>TARGET CUSTOMER</small><p>{d.targetCustomer}</p></div><div className="memory-block"><small>GOAL</small><p>{d.goal}</p></div><div className="memory-block"><small>AUTONOMY</small><p>{d.autonomy} · consequential actions remain governed</p></div></div>
   </section>
   <section className="ceo-panel evidence"><div><span className="ceo-kicker">PROOF BEFORE CLAIM</span><h3>CompanyForge only reports recorded activity.</h3><p>Revenue, visitors, customers and operational results come from recorded events and runtime state. The system does not turn assumptions into business results.</p></div><div className="proof-items"><span>✓ Recorded metrics</span><span>✓ Audit trail</span><span>✓ Approval controls</span><span>✓ Persistent memory</span></div></section>
  </main>
 </div>
}