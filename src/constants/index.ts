// Github
const SCOPES = ['repo'];
export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_BASE_URL = 'https://github.com';
export const GITHUB_CLIENT_ID = 'Ov23li9lnzzAcPnt9BLB';
export const GITHUB_CLIENT_SECRET = '562a9de278575373f851c43ade2820436718fc00';
export const GITHUB_OAUTH_URL = `${GITHUB_BASE_URL}/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=${SCOPES.join(' ')}`;
export const GITHUB_ACCESS_TOKEN_URL = `${GITHUB_BASE_URL}/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;

// AlgoArchive API
export const API_BASE_URL = 'https://api.algoarchive.org';
