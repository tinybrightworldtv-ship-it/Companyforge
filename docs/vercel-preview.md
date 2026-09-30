# Vercel Preview Integration

CompanyForge treats Vercel as a deployment provider, not as proof by itself.

A deployment is preview-ready only when Vercel reports a real READY status and returns deployment evidence. Production promotion remains governed.

The GitHub workflow runs repository tests first. Vercel credentials are secrets and are never committed.
