import { z } from 'zod';

// Repository schema
export const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  fork: z.boolean(),
  url: z.string().url(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  git_url: z.string(),
  ssh_url: z.string(),
  clone_url: z.string().url(),
  language: z.string().nullable(),
  forks_count: z.number(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  default_branch: z.string(),
});

// Search results schema
export const GitHubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(RepoSchema),
});

// File content schema
export const FileContentSchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  url: z.string().url(),
  html_url: z.string().url(),
  git_url: z.string().url(),
  download_url: z.string().url().nullable(),
  type: z.literal('file'),
  content: z.string(),
  encoding: z.string(),
});

// Directory item schema
export const DirectoryItemSchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  url: z.string().url(),
  html_url: z.string().url(),
  git_url: z.string().url(),
  download_url: z.string().url().nullable(),
  type: z.union([z.literal('file'), z.literal('dir')]),
});

// Repository content (either file or directory listing)
export const RepoContentSchema = z.union([
  FileContentSchema,
  z.array(DirectoryItemSchema),
]);

// Code search item schema
export const CodeSearchItemSchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  url: z.string().url(),
  git_url: z.string().url(),
  html_url: z.string().url(),
  repository: z.object({
    name: z.string(),
    full_name: z.string(),
  }),
});

// Code search response schema
export const CodeSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(CodeSearchItemSchema),
});
