import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {Observable, Subscription} from "rxjs";
import {UserService} from '../services/user.service';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import * as firebase from 'firebase';
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy{
  form: FormGroup;
  subscription: Subscription;
  title: string;
  user$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    let userUid = JSON.parse(localStorage.getItem('user'));
    this.user$ = this.userService.getUserById(userUid)
      .pipe(
        tap((document: DocumentSnapshot) => {
          let user = document.data();
          this.title = `Hi ${user.firstName} ${user.lastName}`;
          this.initForm(user);
        })
      )
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private initForm(user: DocumentData): void {
    this.form = this.fb.group({
      firstName: [{value: user.firstName, disabled: true}],
      lastName: [{value: user.lastName, disabled: true}],
      age: [{value: user.age, disabled: true},],
      country: [{value: user.country, disabled: true}]
    });
  }

  logOut(): void {
    this.subscription = this.authService.logout().subscribe();
  }
}
