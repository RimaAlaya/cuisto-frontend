import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  isLoading = true;
  error = '';
  isLiked = false;
  isSaved = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecipe(id);
    } else {
      this.error = 'Recipe ID not found';
      this.isLoading = false;
    }
  }

  loadRecipe(id: string) {
    this.isLoading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load recipe';
        this.isLoading = false;
        console.error('Error loading recipe:', error);
      }
    });
  }

  toggleLike() {
    this.isLiked = !this.isLiked;
    // TODO: Call API to save like
  }

  toggleSave() {
    this.isSaved = !this.isSaved;
    // TODO: Call API to save recipe
  }

  goBack() {
    this.router.navigate(['/recipes']);
  }

  getDifficultyColor(difficulty?: string): string {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'hard': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  }

  getTotalTime(): number {
    if (!this.recipe) return 0;
    return (this.recipe.prepTimeMinutes || 0) + (this.recipe.cookTimeMinutes || 0);
  }
}
