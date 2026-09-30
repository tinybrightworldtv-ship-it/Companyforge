# Multi-Provider LLM Architecture

CompanyForge supports four provider adapters: OpenAI, Anthropic/Claude, Google/Gemini, and Meta/Llama.

## Provider configuration

OPENAI_API_KEY / OPENAI_MODEL
ANTHROPIC_API_KEY / ANTHROPIC_MODEL
GOOGLE_API_KEY / GOOGLE_MODEL
META_API_KEY / META_MODEL
META_API_URL may override the Meta/Llama endpoint when required by the selected Meta offering.

## Routing

Routing is capability-based rather than a quality ranking. Coding, creative, reasoning, research, analysis, and structured tasks can have different preferred provider orders. If a configured provider fails with a retryable error, the router attempts another configured provider.

## Security

Provider secrets are server-side only and must never be committed to GitHub or exposed to browser code.

## Verification

The repository's tests use mock adapters. A live provider is not considered verified until a real request succeeds with a real credential.
