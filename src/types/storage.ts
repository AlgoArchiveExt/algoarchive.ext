import { Problem } from './leetcode';

export interface UserSettings {
  githubAccessToken?: string;
  selectedRepo?: string;
  selectedRepoFullName?: string;
  currentProblem?: Problem;
  owner?: string;
  currentUser?: string;
  stats?: Stats;
}

export interface Stats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  lastFetchTime?: number;
  selectedRepoFullName?: string;
}
