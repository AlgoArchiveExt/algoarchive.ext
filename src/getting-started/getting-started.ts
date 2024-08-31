import {
  ApiClient,
  getFromStorage,
  setInStorage,
  attachListener,
  findLastLeetCodeTab,
} from '@/utils';
import { GITHUB_API_BASE_URL, GITHUB_BASE_URL, GITHUB_APP_INSTALL_PATH } from '@/constants';
import { UserSettings, Repo, InstallationsResponse } from '@/types';
import { ReposResponse } from '@/types/github';

document.addEventListener('DOMContentLoaded', () => {
  const selectRepoBtn = document.getElementById('select-repo-btn')! as HTMLButtonElement;
  const createRepoBtn = document.getElementById('create-repo-btn')! as HTMLButtonElement;
  const repoSelection = document.getElementById('repo-selection')! as HTMLDivElement;
  const createRepo = document.getElementById('create-repo')! as HTMLDivElement;
  const repoSelect = document.getElementById('repo-select')! as HTMLSelectElement;
  const useRepoBtn = document.getElementById('use-repo-btn')! as HTMLButtonElement;
  const newRepoName = document.getElementById('new-repo-name')! as HTMLInputElement;
  const createUseRepoBtn = document.getElementById('create-use-repo-btn')! as HTMLButtonElement;
  const noFoundRepos = document.getElementById('no-found-repos')! as HTMLParagraphElement;

  const apiClient = new ApiClient({ baseUrl: GITHUB_API_BASE_URL });

  attachListener(selectRepoBtn, 'click', () => {
    repoSelection.classList.remove('hidden');
    createRepo.classList.add('hidden');
    noFoundRepos.classList.remove('hidden');
    noFoundRepos.innerHTML = `If you can't see the repository you're looking for, you can configure the github app installation in <a href="${GITHUB_BASE_URL}/${GITHUB_APP_INSTALL_PATH}" target="_blank" style="color: #007bff;">GitHub</a>.`;
  });

  attachListener(createRepoBtn, 'click', () => {
    createRepo.classList.remove('hidden');
    repoSelection.classList.add('hidden');
    noFoundRepos.classList.add('hidden');
  });

  getFromStorage<UserSettings>('algoArchive', (result) => {
    if (result?.githubAccessToken) fetchRepositories(result.githubAccessToken);

    attachListener(repoSelect, 'change', () => {
      const selectedRepoId = repoSelect.value;
      if (selectedRepoId) {
        useRepoBtn.classList.remove('hidden');
      } else {
        useRepoBtn.classList.add('hidden');
      }
    });

    attachListener(useRepoBtn, 'click', () => {
      const selectedRepoName = repoSelect.options[repoSelect.selectedIndex].textContent;

      setInStorage(
        'algoArchive',
        {
          ...result,
          selectedRepo: selectedRepoName,
        },
        () => {
          alert(`Now using repository: ${selectedRepoName}`);
          // close current tab and open the popup
          window.close();
          findLastLeetCodeTab().then((leetCodeTab) => {
            if (leetCodeTab?.id) {
              chrome.tabs.update(leetCodeTab.id, { active: true });
            } else {
              chrome.tabs.create({ url: 'https://leetcode.com/problems/two-sum' });
            }
          });
          repoSelection.classList.add('hidden');
        },
      );
    });
  });

  attachListener(newRepoName, 'input', () => {
    if (newRepoName.value.trim()) {
      createUseRepoBtn.classList.remove('hidden');
    } else {
      createUseRepoBtn.classList.add('hidden');
    }
  });

  attachListener(createUseRepoBtn, 'click', () => {
    const newRepoNameValue = newRepoName.value.trim();
    if (newRepoNameValue) {
      getFromStorage<UserSettings>('algoArchive', (result) => {
        // Here you would make an API call to create the repository
        // call algoarchive API to create a new repo

        // For now, we'll just simulate it
        setInStorage(
          'algoArchive',
          {
            ...result,
            selectedRepo: newRepoNameValue,
          },
          () => {
            createRepo.classList.add('hidden');
          },
        );
      });
    }
  });

  async function fetchRepositories(accessToken: string) {
    const res = await apiClient.get<InstallationsResponse>('user/installations', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let repos: Repo[] = [];

    for (const installation of res.installations) {
      const installationReposRes = await apiClient.get<ReposResponse>(
        `user/installations/${installation.id}/repositories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      repos = [...repos, ...installationReposRes.repositories];
    }

    populateRepoDropdown(repos);
  }

  function populateRepoDropdown(repos: Repo[]) {
    repos.forEach((repo) => {
      const option = document.createElement('option');
      option.value = repo.id.toString();
      option.textContent = repo.name;
      repoSelect.appendChild(option);
    });
  }
});
