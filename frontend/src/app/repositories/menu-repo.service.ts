import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../drivers/api.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class MenuRepoService {
  constructor(
    public apiSvc: ApiService,
    private http: HttpClient,
    private userSvc: UserService
  ) {}

  public getMenus(uid: number, query: any): Observable<any> {
    return this.apiSvc.get(`api/menus/${uid}`, query);
  }

  public getMenu(id: number, query: any): Observable<any> {
    return this.apiSvc.get(`api/menu/${id}`, query);
  }

  public createMenu(uid: number, body: any): Observable<any> {
    return this.apiSvc.post(`api/menu/34`, body);
  }

  public updateMenu(uid: number, id: number, body: any): Observable<any> {
    return this.apiSvc.put(`api/menu/${uid}/${id}`, body);
  }

  public deleteMenu(uid: number, id: number): Observable<any> {
    return this.apiSvc.delete(`api/menu/${uid}/${id}`);
  }

  public uploadImage(uid: number, body: any): Observable<any> {
    const authToken = this.userSvc.jwt$.getValue();
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      }),
    };
    if (environment.ngrokSkipBrowserWarning) {
      options.headers.set('ngrok-skip-browser-warning', 'skip');
    }

    return this.http
      .post<any[]>(`${environment.apiUrl}/api/image/${uid}`, body, {
        ...options,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  public exploreMenu(uid: number, query: any): Observable<any> {
    return this.apiSvc.get(`api/explore/menu/${uid}`, query);
  }
}
