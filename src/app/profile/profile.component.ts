import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{
  form: FormGroup;
  subscription: Subscription;
  title = 'Hi Igor Garnik';

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
    this.form = this.fb.group({
      firstName: ['Igor'],
      lastName: ['Garnik'],
      country: ['Ukraine'],
      age: ['35']
    });
  }

  logOut(): void {
    this.subscription = this.authService.logout().subscribe();
  }
}
