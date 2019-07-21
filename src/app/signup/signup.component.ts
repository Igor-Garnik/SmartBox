import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signUp',
  templateUrl: './signup.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }

  initForm(): void {
    this.signupForm = this.fb.group({
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
        Validators.maxLength(2)
      ]],
      country: ['', Validators.required]
     }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    if (formGroup.get('password').value === formGroup.get('confirmPassword').value)
      return null;
    else
      return { passwordMismatch: true };
  };

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get age() { return this.signupForm.get('age'); }
  get country() { return this.signupForm.get('country'); }

  onPasswordInput() {
    if (this.signupForm.hasError('passwordMismatch')) {
      this.confirmPassword.setErrors([{'passwordMismatch': true}]);
    } else {
      this.confirmPassword.setErrors(null);
    }
  }

  signup() {
    if(this.signupForm.valid) {
      this.subscription = this.authService.signup(this.signupForm.value).subscribe()
    }
  }
}
