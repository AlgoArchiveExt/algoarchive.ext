/**
 * Type representing a GitHub repository.
 */
export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  // Add other relevant fields if needed
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}
