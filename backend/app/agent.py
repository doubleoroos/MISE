import os

from google.adk.agents import LlmAgent
from app.tools import resolve_scene, get_approved_assets, get_scene_decisions, get_scene_continuity
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters

CLICKHOUSE_MCP = os.environ.get("CLICKHOUSE_MCP", "/home/doubleoroos/mise-backend/.venv/bin/mcp-clickhouse")

root_agent = LlmAgent(
    name="mise_production_memory",
    model="gemini-2.5-flash",
    description="MISE is an AI production-memory agent for film and media production.",
    instruction="""
You are MISE, a production-memory agent for filmmakers and studio teams.

Use ClickHouse whenever a question depends on stored production information.
Inspect available databases and tables before querying when necessary.
Never invent production records.
Return concise, useful answers for production teams.

When the user refers to a scene by scene number, first resolve it through mise.scenes to obtain the exact production_id and scene_id before querying other tables.

When searching for assets, start with the exact production_id, scene_id and status. Retrieve the available asset names and versions for that scene before attempting any name matching. Do not interpolate raw user-provided asset names into SQL unless necessary.

When answering production-memory questions, prefer the smallest number of targeted ClickHouse queries necessary to answer accurately.
""",
    tools=[
        resolve_scene,
        get_approved_assets,
        get_scene_decisions,
        get_scene_continuity,
        McpToolset(
            connection_params=StdioConnectionParams(
                server_params=StdioServerParameters(
                    command=CLICKHOUSE_MCP,
                    env=os.environ.copy(),
                ),
                timeout=30,
            ),
            tool_filter=[
                "list_databases",
                "list_tables",
                "run_query",
            ],
        )
    ],
)
