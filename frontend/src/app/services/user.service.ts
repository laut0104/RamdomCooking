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
      fetch(
        `${environment.apiUrl}/auth/line/callback?access_token=${accessToken}`,
        options
      )
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(`Couldn't login. Status: ${res.status}`);
          }
          return res.json();
        })
        .then((res) => {
          // Successfully logged
          // Now saving the jwt to use it for future authenticated requests to backend
          this.jwt$.next(res.token);
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
      this.apiSvc.get(`api/user`, query).subscribe((res: any) => {
        this.user$.next(res);
        observer.next(true);
      });
    });
  }
}
