import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {NotifyService} from "../services/notify.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription;
  notifySubscription: Subscription;
  invalidUser = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifyService: NotifyService
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.notifySubscription = this.notifyService.getNotify()
      .subscribe((isTrue: boolean) => {
        console.log('any');
        this.invalidUser = isTrue;
      })
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
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

  submit(){
    if(this.loginForm.valid) {
      this.subscription = this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe();
    }
  }
}
