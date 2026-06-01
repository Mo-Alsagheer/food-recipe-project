export interface Recipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  cookingTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  rating?: number;
  tags?: string[];
  ingredients: string[];
  steps: string[];
  createdBy: { _id: string; name: string };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  recipes?: T[];
  favorites?: T[];
  data?: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
