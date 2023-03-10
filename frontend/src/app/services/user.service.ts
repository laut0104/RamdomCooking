import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public jwt$ = new BehaviorSubject<string | null>(null);

  constructor() { }

  public login(accessToken: string | null): Observable<boolean> {
    return new Observable((observer) => {
      // const options = environment.ngrokSkipBrowserWarning ? { headers: { 'ngrok-skip-browser-warning': 'skip' } } : {};
      const options = {};
      fetch(
        `${environment.apiUrl}/auth/line/callback?access_token=${accessToken}`, options
      )
        .then((res) => {
          console.log(res.status)
          if (res.status !== 200) {
            throw new Error(`Couldn't login. Status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          // Successfully logged
          // Now saving the jwt to use it for future authenticated requests to backend
          this.jwt$.next(res.token);
          console.log(this.jwt$.getValue())
          observer.next(true);
        })
        .catch((err) => {
          console.log(err);
          observer.next(false);
        });
    });
  }
}
