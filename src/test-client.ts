import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['github-mcp-server.js'],
  });

  const client = new Client(
    {
      name: 'GitHub MCP Test Client',
      version: '1.0.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  try {
    await client.connect(transport);
    console.log('Connected to GitHub MCP server');

    // List all repositories
    console.log('\nFetching repositories...');
    const repos = await client.readResource('github://repos');
    console.log(repos.contents[0].text);

    // Use the search tool to find TypeScript repositories
    console.log('\nSearching for TypeScript repositories...');
    const searchResult = await client.callTool({
      name: 'search-repos',
      arguments: {
        query: 'typescript',
      },
    });
    console.log(searchResult.content[0].text);

    // Get the README of the first result (replace with your repo name)
    // Uncomment and modify with your repository name
    /*
    console.log("\nFetching repository README...");
    const repoName = "your-repo-name";
    const repoInfo = await client.readResource(`github://repos/${repoName}`);
    console.log(repoInfo.contents[0].text);
    
    const readmeContent = await client.readResource(`github://repos/${repoName}/README.md`);
    console.log("\nREADME.md content:");
    console.log(readmeContent.contents[0].text);
    */
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await transport.close();
  }
}

main().catch(console.error);
