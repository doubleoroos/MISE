import os
import json

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

CLICKHOUSE_MCP = os.environ.get("CLICKHOUSE_MCP", "/home/doubleoroos/mise-backend/.venv/bin/mcp-clickhouse")


async def _run_query(query: str):
    server = StdioServerParameters(
        command=CLICKHOUSE_MCP,
        env=os.environ.copy(),
    )

    async with stdio_client(server) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool("run_query", {"query": query})

            if result.isError:
                return {"error": "ClickHouse query failed"}

            payload = result.structuredContent.get("result")
            return json.loads(payload)


async def resolve_scene(scene_number: str):
    query = f"""
    SELECT production_id, scene_id, scene_number, location, description, status
    FROM mise.scenes
    WHERE scene_number = '{scene_number}'
    LIMIT 1
    """
    return await _run_query(query)


async def get_approved_assets(scene_number: str):
    scene = await resolve_scene(scene_number)

    if not scene.get("rows"):
        return {"error": f"Scene {scene_number} not found"}

    production_id = scene["rows"][0][0]
    scene_id = scene["rows"][0][1]

    query = f"""
    SELECT name, version, asset_type, status, uri
    FROM mise.assets
    WHERE production_id = '{production_id}'
      AND scene_id = '{scene_id}'
      AND status = 'approved'
    """
    return await _run_query(query)


async def get_scene_decisions(scene_number: str, category: str = ""):
    scene = await resolve_scene(scene_number)

    if not scene.get("rows"):
        return {"error": f"Scene {scene_number} not found"}

    production_id = scene["rows"][0][0]
    scene_id = scene["rows"][0][1]

    category_filter = ""
    if category:
        normalized = category.strip().lower()

        category_map = {
            "camera decision": "camera",
            "camera decisions": "camera",
            "camera": "camera",
            "lighting decision": "lighting",
            "lighting decisions": "lighting",
            "lighting": "lighting",
            "editorial decision": "editorial",
            "editorial decisions": "editorial",
            "editorial": "editorial",
        }

        normalized = category_map.get(normalized, normalized)
        safe_category = normalized.replace("'", "''")
        category_filter = f"AND category = '{safe_category}'"

    query = f"""
    SELECT category, decision, reason, decided_by, decided_at
    FROM mise.decisions
    WHERE production_id = '{production_id}'
      AND scene_id = '{scene_id}'
      {category_filter}
    """
    return await _run_query(query)


async def get_scene_continuity(scene_number: str):
    scene = await resolve_scene(scene_number)

    if not scene.get("rows"):
        return {"error": f"Scene {scene_number} not found"}

    production_id = scene["rows"][0][0]
    scene_id = scene["rows"][0][1]

    query = f"""
    SELECT department, note, source
    FROM mise.continuity
    WHERE production_id = '{production_id}'
      AND scene_id = '{scene_id}'
    """
    return await _run_query(query)
