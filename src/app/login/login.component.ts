import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription;
  error: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  submit() {
    this.subscription = this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        res => console.log('HTTP response', res),
        err => this.error = err.message
    );
  }
}
