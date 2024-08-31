import { Problem } from './leetcode';

export interface UserSettings {
  githubAccessToken?: string;
  selectedRepo?: string;
  currentProblem?: Problem;
  owner?: string;
}
