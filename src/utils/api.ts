import { API_BASE_URL } from '@/constants';
import { ApiClientOptions } from '@/types/apiClient';

class ApiClient {
  private baseURL: string;

  /**
   * Initializes a new ApiClient instance.
   * @param baseURL The base URL for API requests. Defaults to AlgoArchive [API base URL](https://api.algoarchive.org).
   */
  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseUrl || API_BASE_URL;
  }

  /**
   * Makes a GET request to the API.
   * @param endpoint The API endpoint to hit (e.g., 'user/repos').
   * @returns The response data as a Promise.
   * @throws Error if the request fails.
   *
   * @example
   * const repos = await apiClient.get<Repo[]>('user/repos');
   * console.log(repos);
   */
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}/${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Makes a GET request to the API.
   * @param endpoint The API endpoint to hit (e.g., 'user/repos').
   * @returns The response data as a Promise.
   * @throws Error if the request fails.
   *
   * @example
   * const repos = await apiClient.get<Repo[]>('user/repos');
   * console.log(repos);
   */
  public async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  }

  /**
   * Makes a POST request to the API.
   * @param endpoint The API endpoint to hit (e.g., 'repos').
   * @param body Optional data to send in the request body.
   * @param options Optional request options.
   * @returns The response data as a Promise.
   * @throws Error if the request fails.
   *
   * @example
   * const newRepo = await apiClient.post<Repo, Repo>('repos', { name: 'my-repo' });
   * console.log(newRepo);
   */
  public async post<T = undefined, U = unknown>(endpoint: string, body?: T, options?: RequestInit): Promise<U> {
    return this.request<U>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  }

  // Additional methods like PUT, DELETE can be added here if needed
}

export default ApiClient;
