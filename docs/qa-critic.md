# QA / Critic Agent

The QA/Critic Agent is an evidence gate between Builder output and deployment.

## Checks
Page load, responsive behavior, console/runtime errors, links, CTAs, accessibility, SEO, generated assets, 3D fallback/core-content behavior, and performance sanity.

## Rules
- A claim of success requires evidence.
- A failed or blocked critical check prevents deployment-ready status.
- Every failure should contain an actionable fix when possible.
- The critic does not silently rewrite requirements.
- Production deployment remains governed by approval policy.

## Browser integration
The report format is provider-neutral so browser evidence can come from the future agent-browser/Vercel preview verifier.
