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

  // MOCK DATA - Remove this once your backend is working
  private mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Tunisian Couscous',
      description: 'Traditional Tunisian couscous with vegetables and aromatic spices',
      imageUrl: '',
      cuisine: 'Tunisian',
      mealType: 'lunch',
      dietaryTags: ['vegetarian'],
      difficulty: 'medium',
      prepTimeMinutes: 20,
      cookTimeMinutes: 45,
      servings: 4,
      ingredients: [
        { name: 'Couscous', amount: '2', unit: 'cups' },
        { name: 'Chickpeas', amount: '1', unit: 'can' },
        { name: 'Carrots', amount: '3', unit: 'pcs' },
        { name: 'Zucchini', amount: '2', unit: 'pcs' },
        { name: 'Tomatoes', amount: '4', unit: 'pcs' },
        { name: 'Harissa', amount: '2', unit: 'tbsp' }
      ],
      instructions: [
        'Prepare the couscous according to package instructions',
        'Sauté vegetables with olive oil and harissa',
        'Cook chickpeas until tender',
        'Combine everything and season to taste',
        'Serve hot with extra harissa on the side'
      ],
      nutrition: {
        calories: 350,
        protein: 12,
        carbs: 65,
        fat: 8,
        fiber: 10
      },
      averageRating: 4.8,
      totalRatings: 124
    },
    {
      id: '2',
      title: 'Italian Margherita Pizza',
      description: 'Classic Margherita pizza with fresh mozzarella and basil',
      imageUrl: '',
      cuisine: 'Italian',
      mealType: 'dinner',
      dietaryTags: ['vegetarian'],
      difficulty: 'easy',
      prepTimeMinutes: 15,
      cookTimeMinutes: 12,
      servings: 2,
      ingredients: [
        { name: 'Pizza dough', amount: '1', unit: 'ball' },
        { name: 'Tomato sauce', amount: '1/2', unit: 'cup' },
        { name: 'Mozzarella', amount: '200', unit: 'g' },
        { name: 'Fresh basil', amount: '10', unit: 'leaves' },
        { name: 'Olive oil', amount: '2', unit: 'tbsp' }
      ],
      instructions: [
        'Preheat oven to 475°F (245°C)',
        'Roll out pizza dough',
        'Spread tomato sauce evenly',
        'Add mozzarella cheese',
        'Bake for 12 minutes',
        'Top with fresh basil and olive oil'
      ],
      nutrition: {
        calories: 450,
        protein: 18,
        carbs: 55,
        fat: 16,
        fiber: 3
      },
      averageRating: 4.9,
      totalRatings: 256
    },
    {
      id: '3',
      title: 'Mexican Street Tacos',
      description: 'Authentic street-style tacos with seasoned meat and fresh toppings',
      imageUrl: '',
      cuisine: 'Mexican',
      mealType: 'dinner',
      dietaryTags: [],
      difficulty: 'easy',
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      servings: 4,
      ingredients: [
        { name: 'Ground beef', amount: '500', unit: 'g' },
        { name: 'Taco seasoning', amount: '2', unit: 'tbsp' },
        { name: 'Corn tortillas', amount: '8', unit: 'pcs' },
        { name: 'Onion', amount: '1', unit: 'pcs' },
        { name: 'Cilantro', amount: '1/2', unit: 'cup' },
        { name: 'Lime', amount: '2', unit: 'pcs' }
      ],
      instructions: [
        'Cook ground beef with taco seasoning',
        'Warm tortillas on a griddle',
        'Dice onion and chop cilantro',
        'Assemble tacos with meat',
        'Top with onion, cilantro, and lime juice',
        'Serve immediately'
      ],
      nutrition: {
        calories: 380,
        protein: 25,
        carbs: 30,
        fat: 18,
        fiber: 4
      },
      averageRating: 4.7,
      totalRatings: 189
    },
    {
      id: '4',
      title: 'Japanese Miso Ramen',
      description: 'Rich and flavorful miso ramen with soft-boiled egg',
      imageUrl: '',
      cuisine: 'Japanese',
      mealType: 'lunch',
      dietaryTags: [],
      difficulty: 'medium',
      prepTimeMinutes: 20,
      cookTimeMinutes: 30,
      servings: 2,
      ingredients: [
        { name: 'Ramen noodles', amount: '200', unit: 'g' },
        { name: 'Miso paste', amount: '3', unit: 'tbsp' },
        { name: 'Chicken broth', amount: '4', unit: 'cups' },
        { name: 'Eggs', amount: '2', unit: 'pcs' },
        { name: 'Green onions', amount: '2', unit: 'stalks' },
        { name: 'Nori seaweed', amount: '2', unit: 'sheets' }
      ],
      instructions: [
        'Boil eggs for 6 minutes for soft-boiled',
        'Heat chicken broth and dissolve miso paste',
        'Cook ramen noodles according to package',
        'Slice green onions',
        'Assemble bowls with noodles and broth',
        'Top with egg, green onions, and nori'
      ],
      nutrition: {
        calories: 420,
        protein: 20,
        carbs: 58,
        fat: 12,
        fiber: 4
      },
      averageRating: 4.6,
      totalRatings: 167
    },
    {
      id: '5',
      title: 'Mediterranean Falafel Bowl',
      description: 'Crispy falafel with hummus, salad, and tahini sauce',
      imageUrl: '',
      cuisine: 'Mediterranean',
      mealType: 'lunch',
      dietaryTags: ['vegan', 'vegetarian'],
      difficulty: 'medium',
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      servings: 3,
      ingredients: [
        { name: 'Chickpeas', amount: '2', unit: 'cans' },
        { name: 'Parsley', amount: '1', unit: 'cup' },
        { name: 'Garlic', amount: '3', unit: 'cloves' },
        { name: 'Cumin', amount: '1', unit: 'tsp' },
        { name: 'Tahini', amount: '1/4', unit: 'cup' },
        { name: 'Mixed greens', amount: '2', unit: 'cups' }
      ],
      instructions: [
        'Blend chickpeas, parsley, garlic, and spices',
        'Form into small balls',
        'Fry or bake falafel until golden',
        'Prepare tahini sauce',
        'Assemble bowl with greens',
        'Top with falafel and drizzle sauce'
      ],
      nutrition: {
        calories: 380,
        protein: 15,
        carbs: 48,
        fat: 14,
        fiber: 12
      },
      averageRating: 4.5,
      totalRatings: 143
    },
    {
      id: '6',
      title: 'French Croissants',
      description: 'Buttery, flaky homemade croissants',
      imageUrl: '',
      cuisine: 'French',
      mealType: 'breakfast',
      dietaryTags: ['vegetarian'],
      difficulty: 'hard',
      prepTimeMinutes: 120,
      cookTimeMinutes: 20,
      servings: 8,
      ingredients: [
        { name: 'All-purpose flour', amount: '3', unit: 'cups' },
        { name: 'Butter', amount: '200', unit: 'g' },
        { name: 'Milk', amount: '1', unit: 'cup' },
        { name: 'Yeast', amount: '2', unit: 'tsp' },
        { name: 'Sugar', amount: '2', unit: 'tbsp' },
        { name: 'Salt', amount: '1', unit: 'tsp' }
      ],
      instructions: [
        'Make the dough and let it rest',
        'Laminate with butter through multiple folds',
        'Chill dough between folds',
        'Roll out and cut into triangles',
        'Roll up from wide end to point',
        'Let rise and bake until golden'
      ],
      nutrition: {
        calories: 280,
        protein: 6,
        carbs: 32,
        fat: 14,
        fiber: 2
      },
      averageRating: 4.9,
      totalRatings: 312
    }
  ];

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;

    // Try to load from backend first
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        if (recipes && recipes.length > 0) {
          // Backend has data - use it
          this.recipes = recipes;
          this.filteredRecipes = recipes;
        } else {
          // Backend empty - use mock data
          console.log('Using mock data - backend returned no recipes');
          this.recipes = this.mockRecipes;
          this.filteredRecipes = this.mockRecipes;
        }
        this.isLoading = false;
      },
      error: (error) => {
        // Backend error - use mock data
        console.error('Error loading recipes from backend, using mock data:', error);
        this.recipes = this.mockRecipes;
        this.filteredRecipes = this.mockRecipes;
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
