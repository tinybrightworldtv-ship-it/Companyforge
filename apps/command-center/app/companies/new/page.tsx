"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyCreationInput } from "../../../lib/company-creation";

export default function NewCompanyPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CompanyCreationInput>({
    name: "", description: "", targetCustomer: "", desiredOutcome: "", revenueGoal: "",
    constraints: "", autonomyLevel: "supervised", siteType: "saas", include3D: true,
  });

  function set<K extends keyof CompanyCreationInput>(key: K, value: CompanyCreationInput[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const res = await fetch("/api/companies", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Could not create company."); setBusy(false); return; }
    if (data.taskId) await fetch("/api/tasks/run", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({taskId:data.taskId})}); router.push("/");
  }

  return <main className="form-shell">
    <div className="form-card">
      <div className="eyebrow">COMPANYFORGE / NEW COMPANY</div>
      <h1>Create a company</h1>
      <p className="sub">Describe the outcome. CompanyForge will prepare the business, website, visual system, imagery and purposeful 3D build plan.</p>
      <form onSubmit={submit}>
        <label>Company name<input required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. FlowRecover"/></label>
        <label>What does it do?<textarea required value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe the problem this company solves."/></label>
        <label>Target customer<input required value={form.targetCustomer} onChange={e=>set("targetCustomer",e.target.value)} placeholder="Who specifically will pay?"/></label>
        <label>Desired business outcome<textarea required value={form.desiredOutcome} onChange={e=>set("desiredOutcome",e.target.value)} placeholder="What should this company achieve?"/></label>
        <label>Revenue goal (optional)<input value={form.revenueGoal} onChange={e=>set("revenueGoal",e.target.value)} placeholder="e.g. $10,000 MRR"/></label>
        <label>Constraints / budget (optional)<textarea value={form.constraints} onChange={e=>set("constraints",e.target.value)} placeholder="Budget, geography, timing, technical constraints..."/></label>
        <div className="grid2">
          <label>Website type<select value={form.siteType} onChange={e=>set("siteType",e.target.value as CompanyCreationInput["siteType"])}>{["business","saas","commerce","marketplace","content","portfolio","custom"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label>Autonomy<select value={form.autonomyLevel} onChange={e=>set("autonomyLevel",e.target.value as CompanyCreationInput["autonomyLevel"])}>{["manual","assisted","supervised","autonomous"].map(x=><option key={x}>{x}</option>)}</select></label>
        </div>
        <label className="check"><input type="checkbox" checked={form.include3D} onChange={e=>set("include3D",e.target.checked)}/> Plan purposeful 3D experiences and assets</label>
        {error && <div className="error">{error}</div>}
        <button disabled={busy}>{busy ? "Creating company..." : "Create company + website plan →"}</button>
      </form>
    </div>
  </main>;
}
