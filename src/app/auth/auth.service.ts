import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../user';
import {Observable} from 'rxjs';
import {from} from 'rxjs';
import {catchError, mergeMap, tap} from 'rxjs/internal/operators';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user.uid));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  signUp(form): Observable<void | Response> {
    return from(this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password))
      .pipe(
        mergeMap((user: any) => {
          return this.userService.addUser(user.user.uid, this.fillObject(form));
        }),
        catchError(err => throwError(err))
      );
  }

  login(email: string, password: string): Observable<{}> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        tap(() => {
          this.router.navigateByUrl('/profile').then();
        }),
        catchError(err => throwError(err))
      );
  }

  logout(): Observable<void | {}> {
    return from(this.afAuth.auth.signOut())
      .pipe(
        tap(() => {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/login').then();
        })
      );
  }

  private fillObject(form): User {
    return {
      firstName: form.firstName,
      lastName: form.lastName,
      age: +form.age,
      country: form.country
    };
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
