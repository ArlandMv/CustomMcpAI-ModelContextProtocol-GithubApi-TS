import {
  GitHubSearchResponseSchema,
  RepoSchema,
  RepoContentSchema,
  CodeSearchResponseSchema,
} from './types.js';
import { z } from 'zod';

export class GitHubClient {
  private headers: HeadersInit;
  private apiUrl = 'https://api.github.com';

  constructor(private token: string, public readonly username: string) {
    this.headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'GitHub-MCP',
    };
  }

  async getUserRepositories(): Promise<
    z.infer<typeof GitHubSearchResponseSchema>
  > {
    const searchUrl = new URL(`${this.apiUrl}/search/repositories`);
    searchUrl.searchParams.set('q', `user:${this.username}`);
    searchUrl.searchParams.set('per_page', '100');

    const response = await fetch(searchUrl, { headers: this.headers });
    await this.handleRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return GitHubSearchResponseSchema.parse(data);
  }

  async getRepositoryInfo(repo: string): Promise<z.infer<typeof RepoSchema>> {
    const url = `${this.apiUrl}/repos/${this.username}/${repo}`;

    const response = await fetch(url, { headers: this.headers });
    await this.handleRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return RepoSchema.parse(data);
  }

  async getRepositoryContent(
    repo: string,
    path: string
  ): Promise<z.infer<typeof RepoContentSchema>> {
    const url = `${this.apiUrl}/repos/${this.username}/${repo}/contents/${path}`;

    const response = await fetch(url, { headers: this.headers });
    await this.handleRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return RepoContentSchema.parse(data);
  }

  async searchRepositories(
    query: string
  ): Promise<z.infer<typeof GitHubSearchResponseSchema>> {
    const searchUrl = new URL(`${this.apiUrl}/search/repositories`);
    searchUrl.searchParams.set('q', `${query} user:${this.username}`);

    const response = await fetch(searchUrl, { headers: this.headers });
    await this.handleRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return GitHubSearchResponseSchema.parse(data);
  }

  async searchCode(
    query: string,
    repo?: string
  ): Promise<z.infer<typeof CodeSearchResponseSchema>> {
    const searchUrl = new URL(`${this.apiUrl}/search/code`);
    let searchQuery = `${query} user:${this.username}`;

    if (repo) {
      searchQuery += ` repo:${this.username}/${repo}`;
    }

    searchUrl.searchParams.set('q', searchQuery);

    const response = await fetch(searchUrl, { headers: this.headers });
    await this.handleRateLimit(response);

    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return CodeSearchResponseSchema.parse(data);
  }

  private async handleRateLimit(response: Response): Promise<void> {
    if (response.status === 403) {
      const limit = response.headers.get('X-RateLimit-Limit');
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');

      throw new Error(
        `Rate limit exceeded: ${remaining}/${limit} remaining. Reset at ${new Date(
          Number(reset) * 1000
        )}`
      );
    }
  }
}
