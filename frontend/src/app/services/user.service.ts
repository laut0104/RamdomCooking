import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from '../drivers/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public jwt$ = new BehaviorSubject<string | null>(null);
  public user$ = new BehaviorSubject<any>(null);

  constructor(private apiSvc: ApiService) {}

  public login(accessToken: string | null): Observable<boolean> {
    return new Observable((observer) => {
      const options = environment.ngrokSkipBrowserWarning
        ? { headers: { 'ngrok-skip-browser-warning': 'skip' } }
        : {};
      // const options = {};
      fetch(
        `${environment.apiUrl}/auth/line/callback?access_token=${accessToken}`,
        options
      )
        .then((res) => {
          console.log(res.status);
          if (res.status !== 200) {
            throw new Error(`Couldn't login. Status: ${res.status}`);
          }
          console.log(res);
          return res.json();
        })
        .then((res) => {
          // Successfully logged
          // Now saving the jwt to use it for future authenticated requests to backend
          console.log('test');
          this.jwt$.next(res.token);
          console.log(this.jwt$.getValue());
          observer.next(true);
        })
        .catch((err) => {
          console.log(err);
          observer.next(false);
        });
    });
  }

  public setUserToLocalStorage(lineuserid: string): Observable<boolean> {
    const query = {
      lineuserid: lineuserid,
    };
    return new Observable((observer) => {
      this.apiSvc.get(`user`, query).subscribe((res: any) => {
        console.log(res);
        this.user$.next(res);
        observer.next(true);
      });
    });
  }
}
