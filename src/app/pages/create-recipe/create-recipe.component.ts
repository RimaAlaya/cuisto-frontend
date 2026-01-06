import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})
export class CreateRecipeComponent {
  recipeForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  cuisines = [
    'Italian', 'Tunisian', 'French', 'Mexican', 'Japanese',
    'Indian', 'Chinese', 'Mediterranean', 'American', 'Thai'
  ];

  mealTypes = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'];

  difficulties = ['easy', 'medium', 'hard'];

  dietaryTags = [
    'vegan', 'vegetarian', 'gluten-free', 'dairy-free',
    'low-carb', 'keto', 'paleo', 'halal'
  ];

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [''],
      cuisine: ['', Validators.required],
      mealType: ['', Validators.required],
      dietaryTags: [[]],
      difficulty: ['easy', Validators.required],
      prepTimeMinutes: ['', [Validators.required, Validators.min(1)]],
      cookTimeMinutes: ['', [Validators.required, Validators.min(1)]],
      servings: ['', [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([this.createIngredient()]),
      instructions: this.fb.array([this.createInstruction()]),
      nutrition: this.fb.group({
        calories: [''],
        protein: [''],
        carbs: [''],
        fat: [''],
        fiber: ['']
      })
    });
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      unit: [''],
      optional: [false]
    });
  }

  createInstruction(): FormGroup {
    return this.fb.group({
      step: ['', Validators.required]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addInstruction() {
    this.instructions.push(this.createInstruction());
  }

  removeInstruction(index: number) {
    if (this.instructions.length > 1) {
      this.instructions.removeAt(index);
    }
  }

  toggleDietaryTag(tag: string) {
    const currentTags = this.recipeForm.get('dietaryTags')?.value || [];
    const index = currentTags.indexOf(tag);

    if (index > -1) {
      currentTags.splice(index, 1);
    } else {
      currentTags.push(tag);
    }

    this.recipeForm.patchValue({ dietaryTags: currentTags });
  }

  isDietaryTagSelected(tag: string): boolean {
    const tags = this.recipeForm.get('dietaryTags')?.value || [];
    return tags.includes(tag);
  }

  onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Transform instructions from array of objects to array of strings
    const formValue = this.recipeForm.value;
    const recipeData = {
      ...formValue,
      instructions: formValue.instructions.map((inst: any) => inst.step)
    };

    this.recipeService.createRecipe(recipeData).subscribe({
      next: (recipe) => {
        this.successMessage = 'Recipe created successfully!';
        setTimeout(() => {
          this.router.navigate(['/recipes', recipe.id]);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to create recipe';
        this.isLoading = false;
      }
    });
  }

  get totalTime(): number {
    const prep = this.recipeForm.get('prepTimeMinutes')?.value || 0;
    const cook = this.recipeForm.get('cookTimeMinutes')?.value || 0;
    return parseInt(prep) + parseInt(cook);
  }
}
