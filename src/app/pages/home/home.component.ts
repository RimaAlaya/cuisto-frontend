import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
