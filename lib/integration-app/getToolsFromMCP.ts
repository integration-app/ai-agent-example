import { experimental_createMCPClient } from 'ai';

export async function getToolsFromMCP({
  token,
  app,
}: { token: string; app?: string }) {
  console.log('[getToolsFromMCP] Starting...');
  const INTEGRATION_APP_MCP_SERVER_HOST =
    process.env.INTEGRATION_APP_MCP_SERVER_HOST;

  if (!INTEGRATION_APP_MCP_SERVER_HOST) {
    throw new Error('INTEGRATION_APP_MCP_SERVER_HOST is not set');
  }

  let url = `${INTEGRATION_APP_MCP_SERVER_HOST}/sse`;

  if (app) {
    url = `${url}&integrationKey=${app}`;
  }

  console.time('[getToolsFromMCP] Init 🔌');
  const mcpClient = await experimental_createMCPClient({
    transport: {
      type: 'sse',
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  console.timeEnd('[getToolsFromMCP] Init 🔌');

  let tools = null;

  // Will throw an error is there are no tools so we need to catch it
  try {
    console.time('[getToolsFromMCP] Fetching tools 🔨');
    tools = await mcpClient.tools();
    console.timeEnd('[getToolsFromMCP] Fetching tools 🔨');
  } catch (error) {
    console.error('[getToolsFromMCP] Error fetching tools:', error);
    console.timeEnd('[getToolsFromMCP] Fetching tools 🔨');
  }

  console.log('[getToolsFromMCP] Finished.');
  return { tools: tools || {}, mcpClient };
}
