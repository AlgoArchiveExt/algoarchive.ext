import { UserSettings } from '@/types';
import { getFromStorage } from '@/utils';

getFromStorage<UserSettings>('algoArchive', (result) => {
  if (result && result.githubAccessToken) {
    console.log('GitHub Access Token:', result.githubAccessToken);
    localStorage.setItem('githubAccessToken', result.githubAccessToken);
  }
});
