import { ApiClient, getFromStorage, setInStorage, attachListener } from '@/utils';
import { GITHUB_API_BASE_URL } from '@/constants';
import { UserSettings } from '@/types/storage';
import { Repo } from '@/types/github';

document.addEventListener('DOMContentLoaded', () => {
  const selectRepoBtn = document.getElementById('select-repo-btn')! as HTMLButtonElement;
  const createRepoBtn = document.getElementById('create-repo-btn')! as HTMLButtonElement;
  const repoSelection = document.getElementById('repo-selection')! as HTMLDivElement;
  const createRepo = document.getElementById('create-repo')! as HTMLDivElement;
  const repoSelect = document.getElementById('repo-select')! as HTMLSelectElement;
  const useRepoBtn = document.getElementById('use-repo-btn')! as HTMLButtonElement;
  const newRepoName = document.getElementById('new-repo-name')! as HTMLInputElement;
  const createUseRepoBtn = document.getElementById('create-use-repo-btn')! as HTMLButtonElement;

  const apiClient = new ApiClient({ baseUrl: GITHUB_API_BASE_URL });

  attachListener(selectRepoBtn, 'click', () => {
    repoSelection.classList.remove('hidden');
    createRepo.classList.add('hidden');
  });

  attachListener(createRepoBtn, 'click', () => {
    createRepo.classList.remove('hidden');
    repoSelection.classList.add('hidden');
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
    const repos = await apiClient.get<Repo[]>('user/repos', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

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
