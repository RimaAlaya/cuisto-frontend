import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe';
import { RecipeCardComponent } from '../../shared/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  isLoading = true;
  searchQuery = '';
  selectedCuisine = '';
  selectedMealType = '';
  selectedDietary = '';

  cuisines = ['Italian', 'Tunisian', 'French', 'Mexican', 'Japanese', 'Indian', 'Chinese', 'Mediterranean'];
  mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'];
  dietaryTags = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'low-carb', 'keto'];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.filteredRecipes = recipes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recipes:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredRecipes = this.recipes.filter(recipe => {
      const matchesSearch = !this.searchQuery ||
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesCuisine = !this.selectedCuisine || recipe.cuisine === this.selectedCuisine;
      const matchesMealType = !this.selectedMealType || recipe.mealType === this.selectedMealType;
      const matchesDietary = !this.selectedDietary ||
        recipe.dietaryTags?.includes(this.selectedDietary);

      return matchesSearch && matchesCuisine && matchesMealType && matchesDietary;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCuisineChange() {
    this.applyFilters();
  }

  onMealTypeChange() {
    this.applyFilters();
  }

  onDietaryChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCuisine = '';
    this.selectedMealType = '';
    this.selectedDietary = '';
    this.filteredRecipes = this.recipes;
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedCuisine || this.selectedMealType || this.selectedDietary);
  }
}
