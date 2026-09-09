import asyncio
import os

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main():
    server = StdioServerParameters(
        command="/opt/clickhouse-mcp/bin/mcp-clickhouse",
        env=os.environ.copy(),
    )

    async with stdio_client(server) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print("MCP INITIALIZED")

            result = await session.call_tool(
                "run_query",
                {"query": "SELECT 1 AS ok"},
            )

            print("IS ERROR:", result.isError)
            print("CONTENT:", result.content)
            print("STRUCTURED:", result.structuredContent)


asyncio.run(main())
