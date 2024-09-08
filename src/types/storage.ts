import { Problem } from './leetcode';

export interface UserSettings {
  githubAccessToken?: string;
  selectedRepo?: string;
  selectedRepoFullName?: string;
  currentProblem?: Problem;
  owner?: string;
  currentUser?: string;
}
