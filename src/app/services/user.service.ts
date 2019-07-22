import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {from, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../user';
import {Router} from "@angular/router";
import * as firebase from "firebase";
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private db: AngularFirestore,
    private router: Router
  ) {
  }

  addUser(uid: string, data: User): Observable<void> {
    return from(this.db.collection('/users').doc(uid).set(data))
      .pipe(
        tap( () => this.router.navigateByUrl('/profile')),
        catchError(this.handleError)
      );
  }

  getUserById(uid: string): Observable<DocumentSnapshot> {
    return this.db.collection('users').doc(uid).get()
      .pipe(
        map(user => user),
        catchError(this.handleError)
      );
  }

  updateUser(uid: string, user: User): Observable<any> {
    return from(this.db.collection('users').doc(uid).update(user))
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
