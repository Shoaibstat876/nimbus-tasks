# ADR-003: Agent + Workflow Separation

**Status**: Accepted  
**Date**: 2025-12-10  

## Context
Natural language workflows required orchestration beyond simple commands.

## Decision
- **Agents** handle intelligence (parsing, reasoning)
- **Workflows** orchestrate steps

## Consequences
- Scalable to RAG and auth later
- Clean mental model

## Alternatives
- Single mega-agent (rejected: brittle)
