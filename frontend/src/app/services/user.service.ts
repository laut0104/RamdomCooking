import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() { }

  public login(accessToken: string | null): Observable<boolean> {
    return new Observable((observer) => {
      // const options = environment.ngrokSkipBrowserWarning ? { headers: { 'ngrok-skip-browser-warning': 'skip' } } : {};
      const options = {};
      fetch(
        `${environment.apiUrl}/auth/line/callback?access_token=${accessToken}`, options
      )
        .then((res) => {
          console.log(res)
          // if (res.status !== 200) {
          //   throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
          // }
          // return res.json();
        })
        .then((res) => {
          // Successfully logged with Strapi
          // Now saving the jwt to use it for future authenticated requests to Strapi

          // this.jwt$.next(res.jwt);
          // observer.next(true);
        })
        .catch((err) => {
          console.log(err);
          observer.next(false);
        });
    });
  }
}
