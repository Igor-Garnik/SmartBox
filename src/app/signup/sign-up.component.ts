import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  initForm(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      age: ['', [
        Validators.required,
        Validators.maxLength(2),
        Validators.pattern(/^\d+$/)
      ]],
      country: ['', Validators.required]
     }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    if (formGroup.get('password').value === formGroup.get('confirmPassword').value) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  get firstName() { return this.signUpForm.get('firstName'); }
  get lastName() { return this.signUpForm.get('lastName'); }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get confirmPassword() { return this.signUpForm.get('confirmPassword'); }
  get age() { return this.signUpForm.get('age'); }
  get country() { return this.signUpForm.get('country'); }

  onPasswordInput(): void {
    if (this.signUpForm.hasError('passwordMismatch')) {
      this.confirmPassword.setErrors([{'passwordMismatch': true}]);
    } else {
      this.confirmPassword.setErrors(null);
    }
  }

  signUp() {
    this.subscription = this.authService.signUp(this.signUpForm.value).subscribe();
  }
}
