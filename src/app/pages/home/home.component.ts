import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { RecipeCardComponent } from '../../shared/recipe-card/recipe-card.component';
import { Recipe } from '../../core/models/recipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  features = [
    {
      icon: '✨',
      title: 'AI-Powered Recipes',
      description: 'Get personalized recipe recommendations based on your taste and dietary preferences'
    },
    {
      icon: '📸',
      title: 'Smart Scanning',
      description: 'Take a photo of your ingredients and discover recipes you can make right now'
    },
    {
      icon: '🎯',
      title: 'Track Progress',
      description: 'Build cooking streaks, earn badges, and level up your culinary skills'
    },
    {
      icon: '🌍',
      title: 'Global Cuisines',
      description: 'Explore recipes from around the world, including authentic Tunisian dishes'
    }
  ];

  stats = [
    { value: '10,000+', label: 'Recipes' },
    { value: '50+', label: 'Cuisines' },
    { value: '5,000+', label: 'Happy Cooks' }
  ];

  // AI-powered features
  personalizedRecipes: Recipe[] = [];
  dailyChallenge: Recipe | null = null;
  isLoadingRecommendations = false;
  isLoadingChallenge = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Load AI recommendations if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.loadPersonalizedRecommendations();
      this.loadDailyChallenge();
    }
  }

  loadPersonalizedRecommendations() {
    this.isLoadingRecommendations = true;
    this.http.get<Recipe[]>(`${environment.apiUrl}/recommendations/personalized`)
      .subscribe({
        next: (recipes) => {
          this.personalizedRecipes = recipes.slice(0, 6); // Take only first 6
          this.isLoadingRecommendations = false;
        },
        error: (error) => {
          console.error('Error loading recommendations:', error);
          this.isLoadingRecommendations = false;
          // Silently fail - don't show error to user
          this.personalizedRecipes = [];
        }
      });
  }

  loadDailyChallenge() {
    this.isLoadingChallenge = true;
    this.http.get<Recipe>(`${environment.apiUrl}/recommendations/daily-challenge`)
      .subscribe({
        next: (recipe) => {
          this.dailyChallenge = recipe;
          this.isLoadingChallenge = false;
        },
        error: (error) => {
          console.error('Error loading daily challenge:', error);
          this.isLoadingChallenge = false;
          // Silently fail - don't show error to user
          this.dailyChallenge = null;
        }
      });
  }

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
