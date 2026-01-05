import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../core/models/recipe';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  get totalTime(): number {
    return (this.recipe.prepTimeMinutes || 0) + (this.recipe.cookTimeMinutes || 0);
  }

  get defaultImage(): string {
    // Fallback image based on cuisine
    const cuisineEmojis: { [key: string]: string } = {
      'Italian': '🍝',
      'Tunisian': '🥘',
      'French': '🥐',
      'Mexican': '🌮',
      'Japanese': '🍱',
      'Indian': '🍛',
      'Chinese': '🥢',
      'Mediterranean': '🫒'
    };
    return cuisineEmojis[this.recipe.cuisine] || '🍽️';
  }
}
