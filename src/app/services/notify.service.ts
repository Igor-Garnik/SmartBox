import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  notify = new BehaviorSubject(false);
  constructor() { }

  getNotify(): Observable<any>{
    return this.notify.asObservable();
  }

  setNotify(data: boolean) {
    this.notify.next(data);
  }
}
