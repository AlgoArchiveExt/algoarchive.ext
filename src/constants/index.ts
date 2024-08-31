// Github
// const SCOPES = ['repo'];
export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_BASE_URL = 'https://github.com';
let CLIENT_ID, CLIENT_SECRET;
try {
    CLIENT_ID = import.meta.env.GITHUB_CLIENT_ID;
    CLIENT_SECRET = import.meta.env.GITHUB_CLIENT_SECRET;
  } catch (e) {
    console.log("I won the fight, mr. process!");
}

export const GITHUB_CLIENT_ID = CLIENT_ID;
export const GITHUB_CLIENT_SECRET = CLIENT_SECRET;
export const GITHUB_OAUTH_URL = `${GITHUB_BASE_URL}/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`;
export const GITHUB_ACCESS_TOKEN_URL = `${GITHUB_BASE_URL}/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`;

// AlgoArchive API
export const API_BASE_URL = 'https://api.algoarchive.org';
