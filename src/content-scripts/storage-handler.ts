import { UserSettings } from '@/types';
import { getFromStorage } from '@/utils';

getFromStorage<UserSettings>('algoArchive', (result) => {
  if (result && result.githubAccessToken)
    localStorage.setItem('algoArchive', JSON.stringify(result));
});
