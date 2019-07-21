import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from '../user';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable, throwError} from "rxjs";
import {from} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/internal/operators';
import {HttpErrorResponse} from "@angular/common/http";
import * as firebase from "firebase";
import {NotifyService} from "../services/notify.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  signup(form): Observable<any> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password))
      .pipe(
        mergeMap((user: any) => {
          console.log(user.uid)
          return firebase.database().ref().child( user.uid ).set( {

            firstName: form.firstName,
              lastName: form.last,
            age: form.age,
            country: form.country

          }).then();
          //this.afs.doc(`users/${user.uid}`).update(updates).then();
          this.router.navigateByUrl('/profile').then();
        }),
        catchError(this.handleError)
      )
  }

  login(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap(() => {
          this.router.navigateByUrl('/profile').then();
        }),
        catchError(this.handleError)
      )
  }

  logout(): Observable<void> {
    return from(this.afAuth.auth.signOut())
      .pipe(
        tap(() => {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/login').then();
        })
      )
  }

  private fillObject(form) {
    return {
      firstName: form.firstName,
      lastName: form.last,
      age: form.age,
      country: form.country
    }
  }

  private setUserDoc(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      firstName: user.firstName,
      lastName: user.last,
      email: user.email || null,
      age: user.age,
      country: user.country
    };

    return userRef.set(data)
  }

  // Update properties on the user document
  updateUser(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    this.notify.setNotify(true);
    return throwError('Something bad happened; please try again later.');
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
