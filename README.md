# CompanyForge

Autonomous AI Company Platform.

CompanyForge is designed to help a founder research, validate, build, launch, operate, measure, and continuously improve online businesses through coordinated AI agents.

## Core loop

Goal → Research → Validate → Strategize → Build → Launch → Acquire → Operate → Measure → Diagnose → Improve → Repeat

## Foundation

This repository contains the platform foundation, agent framework, orchestration, integrations, workflows, security controls, tests, and documentation.

## Principles

- Real execution over simulated capability
- Outcome-driven agent work
- Least-privilege permissions
- Human approval for high-impact actions
- Persistent company memory
- Observable and auditable actions
- Safe rollback and emergency controls
- No capability is considered live until it is implemented and tested end-to-end


## Current runtime capabilities

- Multi-provider LLM routing: OpenAI, Anthropic, Google, and Meta Model API adapter.
- Persistent Supabase task state, company memory, approvals, and audit events.
- Dependency-aware autonomous task worker with bounded batch processing.
- Command Center worker endpoint plus a protected Vercel Cron worker endpoint.
- Website specification, asset planning, 3D planning, build-file workspace, preview pipeline, and QA/repair contracts.
- Supabase RLS hardening and runtime/website foreign-key indexes.

## Provider verification

Meta's current official developer materials describe Meta Model API as OpenAI SDK compatible. CompanyForge therefore keeps the Meta endpoint and model configuration-driven rather than hard-coding an unverified endpoint. See the official [Meta Llama developer resources](https://ai.meta.com/llama/get-started/).

A provider is not considered live-verified until CompanyForge successfully completes a real request using a configured credential.

## Deployment verification

The repository contains deployment and scheduled-worker configuration, but no production Vercel deployment is claimed until a real deployment URL and runtime execution evidence are available.
