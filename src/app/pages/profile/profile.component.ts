import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Activity {
  id: string;
  icon: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  editedUser: Partial<User> = {};
  isEditMode = false;
  isSaving = false;

  cuisineOptions = [
    { value: 'Italian', emoji: '🍝' },
    { value: 'Tunisian', emoji: '🥘' },
    { value: 'French', emoji: '🥐' },
    { value: 'Mexican', emoji: '🌮' },
    { value: 'Japanese', emoji: '🍱' },
    { value: 'Indian', emoji: '🍛' },
    { value: 'Chinese', emoji: '🥢' },
    { value: 'Mediterranean', emoji: '🫒' }
  ];

  dietaryOptions = [
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
    { value: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
    { value: 'low-carb', label: 'Low-Carb', emoji: '🥩' },
    { value: 'keto', label: 'Keto', emoji: '🥑' },
    { value: 'paleo', label: 'Paleo', emoji: '🍖' },
    { value: 'halal', label: 'Halal', emoji: '☪️' }
  ];

  allBadges: Badge[] = [
    {
      id: 'first-recipe',
      name: 'First Recipe',
      description: 'Cooked your first recipe',
      icon: '🍳'
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: '7-day cooking streak',
      icon: '🔥'
    },
    {
      id: 'recipe-master',
      name: 'Recipe Master',
      description: 'Cooked 50 recipes',
      icon: '👨‍🍳'
    },
    {
      id: 'healthy-choice',
      name: 'Healthy Choice',
      description: 'Cooked 20 healthy recipes',
      icon: '🥗'
    },
    {
      id: 'world-traveler',
      name: 'World Traveler',
      description: 'Tried 10 different cuisines',
      icon: '🌍'
    },
    {
      id: 'speed-chef',
      name: 'Speed Chef',
      description: 'Completed 10 quick recipes',
      icon: '⚡'
    },
    {
      id: 'dessert-lover',
      name: 'Dessert Lover',
      description: 'Made 15 desserts',
      icon: '🍰'
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Cooked 20 breakfasts',
      icon: '🌅'
    }
  ];

  recentActivities: Activity[] = [
    {
      id: '1',
      icon: '🍝',
      text: 'Cooked "Tunisian Couscous"',
      time: '2 hours ago'
    },
    {
      id: '2',
      icon: '⭐',
      text: 'Rated "Italian Pasta" 5 stars',
      time: '1 day ago'
    },
    {
      id: '3',
      icon: '🏆',
      text: 'Earned "Week Warrior" badge',
      time: '2 days ago'
    },
    {
      id: '4',
      icon: '❤️',
      text: 'Saved "Mexican Tacos" to favorites',
      time: '3 days ago'
    },
    {
      id: '5',
      icon: '✨',
      text: 'Created new recipe "Homemade Pizza"',
      time: '5 days ago'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.resetEditedUser();
    });
  }

  // Level & Progress
  get currentLevel(): number {
    const points = this.user?.points || 0;
    return Math.floor(points / 1000) + 1;
  }

  get nextLevelPoints(): number {
    return this.currentLevel * 1000;
  }

  get pointsToNextLevel(): number {
    const currentPoints = this.user?.points || 0;
    return this.nextLevelPoints - currentPoints;
  }

  get levelProgress(): number {
    const currentPoints = this.user?.points || 0;
    const previousLevelPoints = (this.currentLevel - 1) * 1000;
    const pointsInCurrentLevel = currentPoints - previousLevelPoints;
    return (pointsInCurrentLevel / 1000) * 100;
  }

  get earnedBadges(): string[] {
    return this.user?.badgesEarned || [];
  }

  isBadgeEarned(badgeId: string): boolean {
    return this.earnedBadges.includes(badgeId);
  }

  // Helper methods
  getCuisineEmoji(cuisine: string): string {
    const found = this.cuisineOptions.find(c => c.value === cuisine);
    return found?.emoji || '🍽️';
  }

  getDietaryEmoji(dietary: string): string {
    const found = this.dietaryOptions.find(d => d.value === dietary);
    return found?.emoji || '🥗';
  }

  // Edit mode
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.resetEditedUser();
    }
  }

  resetEditedUser() {
    this.editedUser = {
      firstName: this.user?.firstName || '',
      lastName: this.user?.lastName || '',
      email: this.user?.email || '',
      bio: this.user?.bio || '',
      favoriteCuisines: [...(this.user?.favoriteCuisines || [])],
      dietaryRestrictions: [...(this.user?.dietaryRestrictions || [])]
    };
  }

  isCuisineSelected(cuisine: string): boolean {
    return this.editedUser.favoriteCuisines?.includes(cuisine) || false;
  }

  toggleCuisine(cuisine: string) {
    if (!this.editedUser.favoriteCuisines) {
      this.editedUser.favoriteCuisines = [];
    }

    const index = this.editedUser.favoriteCuisines.indexOf(cuisine);
    if (index > -1) {
      this.editedUser.favoriteCuisines.splice(index, 1);
    } else {
      this.editedUser.favoriteCuisines.push(cuisine);
    }
  }

  isDietarySelected(dietary: string): boolean {
    return this.editedUser.dietaryRestrictions?.includes(dietary) || false;
  }

  toggleDietary(dietary: string) {
    if (!this.editedUser.dietaryRestrictions) {
      this.editedUser.dietaryRestrictions = [];
    }

    const index = this.editedUser.dietaryRestrictions.indexOf(dietary);
    if (index > -1) {
      this.editedUser.dietaryRestrictions.splice(index, 1);
    } else {
      this.editedUser.dietaryRestrictions.push(dietary);
    }
  }

  cancelEdit() {
    this.isEditMode = false;
    this.resetEditedUser();
  }

  saveChanges() {
    this.isSaving = true;

    // TODO: Implement actual API call to update user profile
    setTimeout(() => {
      // Simulate API call
      if (this.user) {
        this.user = {
          ...this.user,
          ...this.editedUser
        };
      }
      this.isSaving = false;
      this.isEditMode = false;
      console.log('Profile updated:', this.editedUser);
    }, 1500);
  }

  changeAvatar() {
    // TODO: Implement avatar upload functionality
    console.log('Change avatar clicked');
    alert('Avatar upload feature coming soon! 📸');
  }
}
