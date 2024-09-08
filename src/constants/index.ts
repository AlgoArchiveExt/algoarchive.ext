// Github
// const SCOPES = ['repo'];
export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_BASE_URL = 'https://github.com';
export const GITHUB_APP_NAME = 'algoarchiveext';
export const GITHUB_APP_ID = import.meta.env.GITHUB_APP_ID;
export const GITHUB_CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;
export const GITHUB_INSTALLATIONS_PATH = `user/installations`;
export const GITHUB_OAUTH_PATH = `login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;
export const GITHUB_APP_INSTALL_PATH = `apps/${GITHUB_APP_NAME}/installations/new`;
export const GITHUB_ACCESS_TOKEN_PATH = `login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;

// AlgoArchive API
export const API_BASE_URL = 'https://api.algoarchive.org';

// Cache
export const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
