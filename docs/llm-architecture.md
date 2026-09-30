# Multi-Provider LLM Architecture

CompanyForge uses a provider-neutral LLM interface with OpenAI, Anthropic, and Google adapters.

## Routing
The router chooses a provider based on task type and availability, then can fall back to another configured provider. Defaults are routing policy, not quality rankings.

## Security
API keys are server-side environment variables only. Never commit keys to GitHub or expose them in browser code.

## Verification
Live provider capability is not claimed until credentials are supplied and an end-to-end request succeeds.