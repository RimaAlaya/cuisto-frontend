import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Recipe, RecipeRequest } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = `${environment.apiUrl}/recipes`;

  constructor(private http: HttpClient) {}

  getAllRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/public/all`);
  }

  getRecipeById(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  getRecipesByCuisine(cuisine: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/cuisine/${cuisine}`);
  }

  getRecipesByMealType(mealType: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/meal-type/${mealType}`);
  }

  getRecipesByDietaryTag(tag: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/dietary/${tag}`);
  }

  createRecipe(recipe: RecipeRequest): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: RecipeRequest): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
