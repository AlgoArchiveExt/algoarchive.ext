import { Problem } from './leetcode';
import { User } from './github';

export interface UserSettings {
  githubAccessToken?: string;
  selectedRepo?: string;
  selectedRepoFullName?: string;
  currentProblem?: Problem;
  owner?: string;
  user?: User;
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
