/**
 * Type representing a GitHub repository.
 */
export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  owner: {
    login: string;
  };
  // Add other relevant fields if needed
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export type Response<T, K extends string> = {
  total_count: number;
} & {
  [key in K]: T[];
};

export interface Installation {
  id: number;
  // Add other relevant fields if needed
}

export type InstallationsResponse = Response<Installation, 'installations'>;
export type ReposResponse = Response<Repo, 'repositories'>;
