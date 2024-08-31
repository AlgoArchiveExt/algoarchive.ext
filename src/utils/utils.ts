import { Problem } from '@/types/leetcode';

export const sanitize = (problem: Problem) => {
  if (problem.title.includes('LeetCode')) {
    problem.title = problem.title.replace(' - LeetCode', '');
  }

  return {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
  };
};
