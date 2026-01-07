import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PantryService } from '../../core/services/pantry.service';
import { RecipeService } from '../../core/services/recipe.service';
import { PantryItem } from '../../core/models/pantry-item';
import { Recipe } from '../../core/models/recipe';
import { RecipeCardComponent } from '../../shared/recipe-card/recipe-card.component';

@Component({
  selector: 'app-pantry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RecipeCardComponent],
  templateUrl: './pantry.component.html',
  styleUrl: './pantry.component.css'
})
export class PantryComponent implements OnInit {
  pantryItems: PantryItem[] = [];
  suggestedRecipes: Recipe[] = [];
  isLoading = false;
  showAddForm = false;
  addItemForm: FormGroup;

  categories = [
    { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
    { value: 'fruits', label: 'Fruits', emoji: '🍎' },
    { value: 'meat', label: 'Meat', emoji: '🥩' },
    { value: 'dairy', label: 'Dairy', emoji: '🥛' },
    { value: 'grains', label: 'Grains', emoji: '🌾' },
    { value: 'spices', label: 'Spices', emoji: '🌶️' },
    { value: 'other', label: 'Other', emoji: '📦' }
  ];

  constructor(
    private fb: FormBuilder,
    private pantryService: PantryService,
    private recipeService: RecipeService
  ) {
    this.addItemForm = this.fb.group({
      ingredientName: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', Validators.required],
      unit: [''],
      expirationDate: ['']
    });
  }

  ngOnInit() {
    this.loadPantryItems();
  }

  loadPantryItems() {
    this.isLoading = true;
    this.pantryService.getMyPantryItems().subscribe({
      next: (items) => {
        this.pantryItems = items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pantry:', error);
        this.isLoading = false;
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.addItemForm.reset();
    }
  }

  addItem() {
    if (this.addItemForm.invalid) {
      this.addItemForm.markAllAsTouched();
      return;
    }

    const newItem = this.addItemForm.value;
    this.pantryService.addPantryItem(newItem).subscribe({
      next: (item) => {
        this.pantryItems.push(item);
        this.addItemForm.reset();
        this.showAddForm = false;
      },
      error: (error) => {
        console.error('Error adding item:', error);
      }
    });
  }

  deleteItem(id: string | undefined) {
    if (!id) return;

    if (confirm('Remove this ingredient from your pantry?')) {
      this.pantryService.deletePantryItem(id).subscribe({
        next: () => {
          this.pantryItems = this.pantryItems.filter(item => item.id !== id);
        },
        error: (error) => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }

  searchRecipes() {
    if (this.pantryItems.length === 0) {
      alert('Add some ingredients to your pantry first!');
      return;
    }

    this.isLoading = true;

    // Simple search: find recipes that contain any of the pantry ingredients
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        const pantryIngredients = this.pantryItems.map(item =>
          item.ingredientName.toLowerCase()
        );

        this.suggestedRecipes = recipes.filter(recipe => {
          const recipeIngredients = recipe.ingredients.map(ing =>
            ing.name.toLowerCase()
          );

          // Check if recipe contains at least 2 pantry ingredients
          const matches = recipeIngredients.filter(ing =>
            pantryIngredients.some(pantryIng =>
              ing.includes(pantryIng) || pantryIng.includes(ing)  // ADD THIS PART
            )
          );

          return matches.length >= 1;  // CHANGE FROM 2 to 1 to show more results
        }).slice(0, 6);

        this.isLoading = false;

        // ADD THIS: Scroll to recipes section
        if (this.suggestedRecipes.length > 0) {
          setTimeout(() => {
            document.querySelector('.suggested-recipes')?.scrollIntoView({
              behavior: 'smooth'
            });
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error searching recipes:', error);
        this.isLoading = false;
      }
    });
  }

  getCategoryEmoji(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.emoji || '📦';
  }

  getItemsByCategory(category: string): PantryItem[] {
    return this.pantryItems.filter(item => item.category === category);
  }

  get totalItems(): number {
    return this.pantryItems.length;
  }

  get categoriesWithItems(): string[] {
    return [...new Set(this.pantryItems.map(item => item.category))];
  }
}
