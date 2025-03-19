import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import z from "zod";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { zodToJsonSchema } from "zod-to-json-schema";

dotenv.config();
//const GITHUB_TOKENN = "YOUR-TOKEN";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
//const GITHUB_USER = "arland";
const GITHUB_USER = process.env.GITHUB_USER;

// GitHub API schemas
const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  updated_at: z.string(),
  visibility: z.string().optional(),
});

const GetReposSchema = z.object({
  owner: z.string().describe("GitHub username or organization name"),
});
const GetRepoInfoSchema = z.object({
  owner: z.string().describe("GitHub username or organization name"),
  repo: z.string().describe("Repository name"),
});

// 1. MCP Server
const server = new Server(
  { name: "repos", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// 2. define list of tools old way
/*

server.tool(
    "get-repos",
    "Retrieve list of repositories for a GitHub user",
    {
      owner: z.string().describe("GitHub username or organization name"),
    },
    async ({ owner }) => {
      const url = `https://api.github.com/users/${encodeURIComponent(owner)}/repos`;
      const repos = await makeGitHubRequest(url, z.array(GitHubRepoSchema));
  
      if (!repos) {
        return {
          content: [{
            type: "text",
            text: "Failed to retrieve repository list",
          }],
        };
      }
  
      const formattedRepos = repos.map(repo => 
        `📦 ${repo.full_name}
        ${repo.description || "No description"}
        🌟 ${repo.stargazers_count} | 🍴 ${repo.forks_count}
        📅 Last updated: ${new Date(repo.updated_at).toLocaleDateString()}
        🔗 ${repo.html_url}`
        .split('\n').map(line => line.trim()).join('\n')
      ).join("\n\n");
  
      return {
        content: [{
          type: "text",
          text: `Repositories for ${owner}:\n\n${formattedRepos}`,
        }],
      };
    }
  );
*/

// 2. define list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    /*{
      name: "get-repos",
      description: "Retrieve list of repositories for a GitHub user",
      inputSchema: zodToJsonSchema(GetReposSchema),
    },*/
    {
      name: "get-repo-info",
      description: "Retrieve detailed information about a specific repository",
      inputSchema: zodToJsonSchema(GetRepoInfoSchema),
    },
  ],
}));

// Helper function
async function makeGitHubRequest(url: string): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "mcp-github-server/1.0",
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("GitHub API request failed:", error);
    return null;
  }
}

// 3. Define tool call logic
// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "get-repo-info") {
      const args = GetRepoInfoSchema.parse(request.params.arguments);
      const url = `https://api.github.com/repos/${encodeURIComponent(
        args.owner
      )}/${encodeURIComponent(args.repo)}`;
      const data = await makeGitHubRequest(url);

      if (!data) {
        throw new Error("Failed to retrieve repository information");
      }

      // Validate response structure
      const repo = GitHubRepoSchema.parse(data);

      const formattedInfo = [
        `🏷️ ${repo.full_name}`,
        `📝 ${repo.description || "No description"}`,
        `🌐 ${repo.html_url}`,
        "",
        "📊 Stats:",
        `  🌟 Stars: ${repo.stargazers_count}`,
        `  🍴 Forks: ${repo.forks_count}`,
        `  👀 Visibility: ${repo.visibility || "public"}`,
        "",
        `💻 Language: ${repo.language || "Not specified"}`,
        `📅 Updated: ${new Date(repo.updated_at).toLocaleDateString()}`,
      ].join("\n");

      return {
        content: [
          {
            type: "text",
            text: formattedInfo,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid API response: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
});

/*
async function getRepos(owner: string) {
  const url = `https://api.github.com/users/${encodeURIComponent(owner)}/repos`;
  const repos = await makeGitHubRequest(url, z.array(GitHubRepoSchema));
  if (!repos) {
    return {
      content: [{
        type: "text",
        text: "Failed to retrieve repository list",
      }],
    };
  }*/

// Start the server
async function runServer() {
  //console.log("GitHub repository server started");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
