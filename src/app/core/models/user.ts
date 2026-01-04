export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  favoriteCuisines?: string[];
  dietaryRestrictions?: string[];
  cookingStreak?: number;
  totalRecipesCooked?: number;
  badgesEarned?: string[];
  points?: number;
  roles?: string[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  favoriteCuisines?: string[];
  dietaryRestrictions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}
