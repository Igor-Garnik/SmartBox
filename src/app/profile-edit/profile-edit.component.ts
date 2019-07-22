import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {UserService} from "../services/user.service";
import {tap} from "rxjs/operators";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;
import * as firebase from 'firebase';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  title = 'EDIT';
  userUid: string;
  user$: Observable<any>;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userUid = JSON.parse(localStorage.getItem('user'));
    this.user$ = this.userService.getUserById(this.userUid)
      .pipe(
        tap((document: DocumentSnapshot) => {
          this.initForm(document.data());
        })
      )
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private initForm(user: DocumentData): void {
    this.form = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      age: [user.age, [
        Validators.required,
        Validators.maxLength(2)
      ]],
      country: [user.country, Validators.required]
    });
  }

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get email() { return this.form.get('email'); }
  get age() { return this.form.get('age'); }
  get country() { return this.form.get('country'); }

  save(): void {
    this.userService.updateUser(this.userUid, this.getObject())
      .subscribe(() => this.router.navigateByUrl('/profile'));
  }

  private getObject(): User {
    return {
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      age: this.age.value,
      country: this.country.value
    };
  }
}
