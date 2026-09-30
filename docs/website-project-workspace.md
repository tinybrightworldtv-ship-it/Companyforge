# Website Project Workspace

CompanyForge now has a persistent website_build_files representation for generated website files.

## Lifecycle
WebsiteSpec → BuildPlan → persisted files → validation/build → preview → QA/Critic → approval → deployment.

Files are scoped through the website build and company owner RLS policies. Deployment is not implied by persistence.