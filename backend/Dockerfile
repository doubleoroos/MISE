FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

# ClickHouse MCP in its own isolated environment
RUN uv venv /opt/clickhouse-mcp
RUN uv pip install \
    --python /opt/clickhouse-mcp/bin/python \
    mcp-clickhouse==0.6.0

# MISE agent environment
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY app ./app
COPY mcp_cloud_test.py ./

ENV GOOGLE_CLOUD_PROJECT=mise-505907
ENV GOOGLE_CLOUD_LOCATION=europe-west4
ENV GOOGLE_GENAI_USE_VERTEXAI=TRUE

ENV CLICKHOUSE_MCP=/opt/clickhouse-mcp/bin/mcp-clickhouse

CMD ["/app/.venv/bin/adk", "api_server", "--host", "0.0.0.0", "--port", "8080"]
