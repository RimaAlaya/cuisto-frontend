import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  currentStep = 1;

  cuisines = [
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
    { value: 'keto', label: 'Keto', emoji: '🥑' }
  ];

  selectedCuisines: Set<string> = new Set();
  selectedDietary: Set<string> = new Set();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleCuisine(cuisine: string) {
    if (this.selectedCuisines.has(cuisine)) {
      this.selectedCuisines.delete(cuisine);
    } else {
      this.selectedCuisines.add(cuisine);
    }
  }

  toggleDietary(option: string) {
    if (this.selectedDietary.has(option)) {
      this.selectedDietary.delete(option);
    } else {
      this.selectedDietary.add(option);
    }
  }

  nextStep() {
    if (this.currentStep === 1 && this.registerForm.valid) {
      this.currentStep = 2;
    }
  }

  previousStep() {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const registerData = {
      ...this.registerForm.value,
      favoriteCuisines: Array.from(this.selectedCuisines),
      dietaryRestrictions: Array.from(this.selectedDietary)
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
}
