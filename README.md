# CustomMcpAI-ModelContextProtocol-GithubApi-TS

Proyecto inicial utilizando el Protocolo de Contexto de Modelo (MCP) para conectar IA con la API de GitHub mediante TypeScript, con el objetivo de exponer datos de repositorios de forma estandarizada para modelos de lenguaje (LLMs).

## Basic Structure
index.ts
// 0. Import dependencies
// 1. MCP Server
// 2. define list of tools
// 3. add tool call logic
// 4. start server

# GitHub Repository Searcher | MCP Server

A Model Context Protocol (MCP) server that exposes GitHub repository information through tools for use with WindSurf Editor and other compatible AI tools.

## Features

- List repositories from a GitHub user
- Search for repositories with custom queries
- Get detailed information about specific repositories

## Prerequisites

- Node.js 16 or higher
- npm 

## Setup

1. Clone this repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file with your GitHub token (optional but recommended to avoid rate limits)

```
GITHUB_TOKEN=your_github_token_here
```

4. Build the TypeScript code

```bash
npm run build
```

## Usage with WindSurf Editor

This server implements MCP tools that can be used by AI models like Claude to interact with GitHub repositories. It's designed for use with WindSurf Editor's AI Flow feature.

### Tools Provided

1. **list_user_repos** - Lists repositories from a specified GitHub user
   - Parameters:
     - `username` (required): GitHub username
     - `page` (optional): Page number for pagination (default: 1)
     - `perPage` (optional): Repositories per page (default: 30)

2. **search_repositories** - Searches GitHub repositories with a query
   - Parameters:
     - `query` (required): Search query
     - `page` (optional): Page number for pagination (default: 1)
     - `perPage` (optional): Repositories per page (default: 30)

3. **get_repo_details** - Gets detailed information about a specific repository
   - Parameters:
     - `owner` (required): Repository owner (username)
     - `repo` (required): Repository name

### Running the Server

```bash
node build/index.js
```

### Testing with MCP Client

You can test this server using the MCP client from the documentation:

```bash
node build/index.js path/to/this/github-repo-server.js
```

Then in the interactive prompt, you can try queries like:

- "List the repositories for user 'octocat'"
- "Search for repositories about 'machine learning'"
- "Get details about the 'react' repository from 'facebook'"

## Dependencies

- `@modelcontextprotocol/sdk`: MCP server implementation
- `node-fetch`: HTTP client for GitHub API calls
- `zod`: Runtime type validation
- `dotenv`: Environment variable management

## License

MIT

<!-- add this as a feature
 it is better to work with the package node-fetch because It supports streaming responses, allowing you to process large datasets or files without loading the entire response into memory, which can be very useful for working with APIs like GitHub that may return large payloads.

"@modelcontextprotocol/sdk": "^1.4.0",=>
server.tool(
    "get-repos",
    "Retrieve list of repositories for a GitHub user",
    {
"@modelcontextprotocol/sdk": "^1.7.0",=>
 server.setRequestHandler(RequestSchema, ()=>{});
-->