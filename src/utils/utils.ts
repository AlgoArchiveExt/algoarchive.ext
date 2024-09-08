import { Problem } from '@/types/leetcode';

export const sanitize = (problem: Problem): Problem => {
  if (problem.title.includes('LeetCode')) problem.title = problem.title.replace(' - LeetCode', '');

  if (problem.id && problem.id.includes('. ')) problem.id = problem.id.split('. ')[0];

  return {
    ...problem,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    id: problem.id,
  };
};
