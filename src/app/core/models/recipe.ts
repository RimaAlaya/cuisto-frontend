export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cuisine: string;
  mealType: string;
  dietaryTags?: string[];
  difficulty?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: Nutrition;
  authorId?: string;
  likes?: number;
  averageRating?: number;
  totalRatings?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
}

export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface RecipeRequest {
  title: string;
  description?: string;
  imageUrl?: string;
  cuisine: string;
  mealType: string;
  dietaryTags?: string[];
  difficulty?: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: Nutrition;
}
