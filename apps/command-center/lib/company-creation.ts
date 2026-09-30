import { createClient } from "./supabase/server";

export type CompanyCreationInput = {
  name: string;
  description: string;
  targetCustomer: string;
  desiredOutcome: string;
  revenueGoal: string;
  constraints: string;
  autonomyLevel: "manual" | "assisted" | "supervised" | "autonomous";
  siteType: "business" | "saas" | "commerce" | "marketplace" | "content" | "portfolio" | "custom";
  include3D: boolean;
};

export async function createCompany(input: CompanyCreationInput) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) throw new Error("You must be signed in.");

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ owner_id: userId, name: input.name.trim(), description: input.description.trim(), status: "draft" })
    .select("id,name")
    .single();

  if (companyError || !company) throw new Error(companyError?.message ?? "Could not create company.");

  try {
    const { error: profileError } = await supabase.from("company_profiles").insert({
      company_id: company.id,
      target_customer: input.targetCustomer.trim(),
      desired_outcome: input.desiredOutcome.trim(),
      revenue_goal: input.revenueGoal.trim() || null,
      constraints: input.constraints.trim() || null,
      autonomy_level: input.autonomyLevel,
    });
    if (profileError) throw new Error(profileError.message);

    const pages = ["Home", "About", "How it works", "Pricing", "FAQ", "Contact"];
    const features = ["Responsive design", "SEO foundation", "Conversion CTAs", "Analytics-ready", "Accessibility checks"];
    const threeDPlan = input.include3D
      ? { enabled: true, approach: "contextual", formats: ["interactive-scene", "product-object"], performanceBudget: "lazy-load noncritical 3D" }
      : { enabled: false };

    const { data: website, error: websiteError } = await supabase
      .from("website_builds")
      .insert({
        company_id: company.id,
        status: "planning",
        site_type: input.siteType,
        pages,
        features,
        three_d_plan: threeDPlan,
        visual_direction: { status: "pending_ai_design", principle: "brand and customer context determine the visual system" },
      })
      .select("id")
      .single();
    if (websiteError || !website) throw new Error(websiteError?.message ?? "Could not initialize website build.");

    const assetPlans = [
      { asset_type: "logo", prompt: "Create a distinctive brand identity direction from the company thesis and target customer.", status: "planned" },
      { asset_type: "image", prompt: "Create a hero visual that communicates the customer problem and desired outcome.", status: "planned" },
      { asset_type: "illustration", prompt: "Create supporting visuals consistent with the approved brand direction.", status: "planned" },
      ...(input.include3D ? [
        { asset_type: "3d_scene", prompt: "Design an interactive 3D scene only where it improves product understanding or conversion.", status: "planned" },
        { asset_type: "3d_model", prompt: "Plan product/service 3D objects when the business model benefits from them.", status: "planned" },
      ] : []),
    ];
    const { error: assetsError } = await supabase.from("website_assets").insert(
      assetPlans.map(asset => ({ website_build_id: website.id, ...asset }))
    );
    if (assetsError) throw new Error(assetsError.message);

    const memory = [
      ["company_goal", input.desiredOutcome],
      ["target_customer", input.targetCustomer],
      ["revenue_goal", input.revenueGoal || "Not specified"],
      ["website_strategy", "Build a production-ready website based on validated company requirements; do not fabricate research or results."],
      ["visual_strategy", input.include3D ? "Use generated imagery plus purposeful, performance-conscious 3D." : "Use generated imagery; add 3D only if later justified."],
    ];
    const { error: memoryError } = await supabase.from("company_memory_items").insert(
      memory.map(([memory_key, content]) => ({
        company_id: company.id,
        memory_type: memory_key === "company_goal" ? "decision" : "instruction",
        memory_key,
        content,
        confidence: 1,
        importance: 90,
      }))
    );
    if (memoryError) throw new Error(memoryError.message);

    const { error: taskError } = await supabase.from("runtime_tasks").insert({
      company_id: company.id,
      objective: "Create the company's validated business thesis, research plan, website specification, brand direction, image plan, 3D plan, and execution roadmap.",
      assigned_agent: "ai-ceo-orchestrator",
      priority: "high",
      inputs: { targetCustomer: input.targetCustomer, desiredOutcome: input.desiredOutcome, siteType: input.siteType },
      constraints: [input.constraints].filter(Boolean),
      dependencies: [],
      expected_outcome: "A validated execution plan plus a website specification ready for Builder and Creative agents.",
      approval_required: false,
      approval_status: "not_required",
      status: "queued",
    });
    if (taskError) throw new Error(taskError.message);

    return { companyId: company.id, websiteBuildId: website.id };
  } catch (error) {
    await supabase.from("companies").delete().eq("id", company.id).eq("owner_id", userId);
    throw error;
  }
}
