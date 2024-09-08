export interface Difficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface AllSolutionsCountByDifficulty {
  difficulties: Difficulty;
}

export interface AllSolutionsCount {
  solutions_count: number;
}
