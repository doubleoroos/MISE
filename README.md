# MISE

> Production Memory for Filmmakers.

**Created by**: Roos van der Jagt / Double O Roos  
**Submitted through**: Stichting Earth Rising

## Overview

**MISE** is an AI-powered Production Memory system designed for film and media production teams. It provides filmmakers, producers, editors, VFX supervisors, and studio crews with a single, verifiable layer of truth to query critical production knowledge, including:

- **Scenes**: Locations, scene numbering, coverage status, and scene context.
- **Approved Assets**: Approved cuts, VFX passes, audio stems, color grades, and exact version statuses (e.g., `v7 Approved`).
- **Creative Decisions**: Explicit directorial decisions with rationale preserved for editorial, cinematography, and sound.
- **Camera Decisions**: Focal length choices, sensor modes, movement notes, and framing constraints.
- **Lighting Decisions**: Color temperature, mood shifts, key-to-fill ratios, and practical fixture rules.
- **Continuity Notes**: Wardrobe tracking, prop placement, narrative time progression, and subtle atmospheric cues.
- **Production History**: Contextual timeline and decisions captured across pre-production and principal photography.

The current live demo production loaded in the system is **SCOPE CREEP**.

---

## Why MISE

During film and high-end episodic production, vital decisions are made daily on set, in video village, over email threads, on messaging channels, and inside department folders. Over weeks of production, this knowledge becomes fragmented:

- Editorial cuts with outdated or unapproved VFX renders.
- Second unit shoots without knowing why a specific lens or lighting setup was selected on the main unit.
- Continuity supervisors track wardrobe and action manually across disconnected notes.
- Crucial creative intent—the *why* behind a decision—is lost between shooting and post-production.

**The Goal**: Transform scattered production history into a structured, searchable, and authoritative memory layer that active film crews can query directly at any stage of production.

---

## How It Works

MISE executes an end-to-end agentic workflow where every answer is grounded in validated production records:

```text
User Question
      │
      ▼
MISE Frontend (Google AI Studio UI)
      │
      ▼
Google Cloud Run (Application Service)
      │
      ▼
Google ADK (Agent Development Kit)
      │
      ▼
Gemini 2.5 Flash on Vertex AI (Reasoning & Orchestration)
      │
      ▼
Semantic Production-Memory Tools
      │
      ▼
Official mcp-clickhouse MCP Server (Model Context Protocol)
      │
      ▼
ClickHouse Cloud (Production Memory Database)
      │
      ▼
Verified Response to Crew
```

**ClickHouse is actively queried at runtime**: Whenever a crew member asks a question, Gemini selects the appropriate semantic production tool, which executes live SQL against ClickHouse Cloud via the official `mcp-clickhouse` server before returning the response.

---

## Tech Stack

- **Model**: Gemini 2.5 Flash on Vertex AI
- **Agent Framework**: Google Agent Development Kit (ADK)
- **Runtime & Hosting**: Google Cloud Run (Europe-West4)
- **Secrets Management**: Google Cloud Secret Manager
- **Production Database**: ClickHouse Cloud
- **Tool Protocol**: Official `mcp-clickhouse` Model Context Protocol (MCP) server
- **Language**: Python (Agent & MCP bridge) / TypeScript (Web client)
- **Containerization**: Docker (multi-environment isolation)
- **Interface**: Google AI Studio

---

## ClickHouse Integration

MISE was built specifically for the **ClickHouse Track** of the Google Cloud Agentic Cinema Hackathon.

Key integration characteristics:
- **Active Runtime Querying**: MISE queries ClickHouse Cloud dynamically during live conversations. It is an active runtime integration, not a mock or README-only implementation.
- **Official MCP Server**: All database interactions flow through the official `mcp-clickhouse` server adhering to the Model Context Protocol standard.
- **Semantic Tool Boundary**: Rather than exposing raw, unconstrained SQL generation to the language model, MISE implements targeted semantic production tools that translate film crew inquiries into precise analytical queries:
  - `resolve_scene`: Resolves scene references, scene numbers, titles, and shooting conditions.
  - `get_approved_assets`: Fetches approved asset versions, review status, and deliverables for a scene.
  - `get_scene_decisions`: Retrieves directorial, camera, and lighting decisions along with the captured creative rationale.
  - `get_scene_continuity`: Queries critical continuity constraints and department-level priority notes.

---

## Demo Production

### Production: SCOPE CREEP

*SCOPE CREEP* is the sole live production currently instantiated in the ClickHouse memory store.

### Example Working Queries

Crews can ask natural production questions such as:

- *“Which version of Lauren’s entrance master is approved?”*
- *“What camera decision should editorial preserve for scene 23?”*
- *“Why was the lighting changed in scene 41?”*
- *“What continuity note should the team remember for scene 41?”*

### Confirmed Demo Data

The database contains verified production records for the following scenes:

#### Scene 23 — Arrival Sequence
- **Approved Asset**: Lauren entrance master
  - **Version**: `v7`
  - **Status**: `Approved`
- **Camera Decision**: 35mm lens choice for the master setup
  - **Reason**: *“Keep the smart home environment present while preserving intimacy.”*
- **Continuity Note**: Lauren wears the cobalt-blue dress throughout the arrival sequence.

#### Scene 41 — Night Interior
- **Lighting Decision**: Shift to colder moonlight illumination
  - **Reason**: *“Increase tension before the house reveals its attachment to Lauren.”*
- **Continuity Note**: The house must show subtle preference for Lauren before any explicit narrative reveal.

---

## Architecture

```text
Google AI Studio UI
        |
        v
Google Cloud Run
        |
        v
Google ADK + Gemini 2.5 Flash
        |
        v
MISE Semantic Tools
        |
        v
Official mcp-clickhouse
        |
        v
ClickHouse Cloud
```

---

## Deployment

- **Frontend**: [https://mise-agentic-cinema.ai.studio](https://mise-agentic-cinema.ai.studio)
- **Backend Service**: [https://mise-agent-191734425128.europe-west4.run.app](https://mise-agent-191734425128.europe-west4.run.app)
- **Google Cloud Project**: `mise-505907`
- **Hosting Region**: `europe-west4` on Google Cloud Run

---

## Local Development

### Prerequisites

- Python 3.10+
- Docker
- Google Cloud CLI (`gcloud`) with access to Vertex AI
- ClickHouse Cloud account and instance credentials

### Required Environment Variables

Configure your local environment or `.env` file using the following placeholders:

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT="mise-505907"
GOOGLE_CLOUD_LOCATION="europe-west4"
GOOGLE_GENAI_USE_VERTEXAI="true"

# ClickHouse Cloud Configuration
CLICKHOUSE_HOST="<your-clickhouse-host>.clickhouse.cloud"
CLICKHOUSE_PORT="8443"
CLICKHOUSE_USER="default"
CLICKHOUSE_PASSWORD="<your-clickhouse-password>"
CLICKHOUSE_SECURE="true"
CLICKHOUSE_VERIFY="true"
```

> **Security Note**: Store `CLICKHOUSE_PASSWORD` in a secure secrets manager or untracked local environment file. Never commit real credentials to version control.

---

## Running the Agent

The MISE backend runs locally using the Google Agent Development Kit (ADK) entrypoint.

Ensure environment variables are loaded and invoke the ADK agent runtime:

```bash
# Activate virtual environment
source .venv/bin/activate

# Launch ADK development server using the existing project entrypoint
adk run
```

---

## Docker Configuration

The production Docker container uses an isolated environment design:

1. **ADK Runtime Environment**: Hosts the Google ADK, Gemini SDK, and agent orchestration logic.
2. **Isolated MCP Environment**: Runs `mcp-clickhouse` in a dedicated virtual environment within the same container.

**Why Isolation Matters**: Packaging `mcp-clickhouse` in its own isolated Python environment prevents transitive dependency and version conflicts between Google Cloud client packages and MCP runtime dependencies.

---

## Challenges

During hackathon development and Cloud Run deployment, the team resolved several technical hurdles:

- **MCP Dependency Isolation**: Resolved dependency conflicts between Google ADK and `mcp-clickhouse` by establishing dual virtual environments in the container build.
- **Cloud Run Deployment Debugging**: Configured container cold-start behavior, port binding, and process supervisory trees to coordinate the ADK agent and MCP child processes.
- **Secret Manager Formatting**: Resolved authentication failures caused by trailing newlines in secrets injected from Secret Manager into environment variables.
- **Multi-Stage Verification**: Validated networking and connectivity in discrete stages (DNS resolution → TLS/TCP handshake on port 8443 → direct ClickHouse client queries → MCP protocol calls).
- **End-to-End Verification**: Achieved reliable runtime round-trips from natural language prompt through Gemini tool calls to ClickHouse Cloud and back.

---

## What We Learned

- **Structured Memory Over Raw SQL**: Grounding agent capabilities in semantic tools with schema awareness produces substantially higher accuracy and prevents hallucinated SQL queries or runtime execution errors.
- **MCP as a System Boundary**: The Model Context Protocol provides a clean, decoupled boundary between agent reasoning and stateful database drivers.
- **Runtime Verification**: Testing direct protocol connections separately from agent tool calling accelerated debugging and ensured production reliability.
- **Contextual Film Needs**: Film crews require verified approvals and explicit creative rationales, making deterministic record retrieval essential.

---

## Future Work

The following features represent the forward-looking roadmap and are **not yet implemented in the current release**:

- **New Production Ingestion**: Automated onboarding workflow for new production projects. *(The current UI modal represents an intake design workflow).*
- **Screenplay Upload**: Parsing `.fdx` (Final Draft) and PDF scripts to automatically extract scenes, locations, characters, and stage directions.
- **Production Document Ingestion**: Ingesting call sheets, script supervisor logs, camera reports, and sound notes directly into ClickHouse.
- **Multiple Active Productions**: Multi-tenant support allowing crews to toggle across concurrent studio productions beyond *SCOPE CREEP*.
- **Role-Aware Answers**: Tailoring response density and terminology based on the querying department (e.g., editorial vs. grip vs. VFX).
- **Automated Continuity Alerts**: Proactive notifications when scheduled shooting setups conflict with recorded continuity constraints.
- **Production Timelines**: Interactive visual timelines mapping decisions and approved cuts across the production calendar.
- **Asset Approval Workflows**: In-app signing, status changes, and version promotions for department heads.
- **Multimodal Production Search**: Visual similarity matching against storyboard sketches, reference frames, and camera metadata.

---

## Hackathon

- **Event**: Google Cloud Agentic Cinema Hackathon
- **Track**: ClickHouse Track
- **Project**: MISE — Production Memory for Filmmakers
- **Created by**: Roos van der Jagt / Double O Roos
- **Submitted through**: Stichting Earth Rising
- Built and verified during the hackathon period.

---

## License

This repository is distributed under the open-source license provided in this repository. See the repository root for terms and conditions.
