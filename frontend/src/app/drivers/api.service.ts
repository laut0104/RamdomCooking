import { Injectable } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private httpBackend: HttpBackend) {}
  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // setMultiPartFormDataHeader() {
  //   this.options.headers = this.options.headers.set(
  //     'Content-Type',
  //     'multipart/form-data'
  //   );
  // }

  // removeContentTypeHeader() {
  //   this.options.headers = this.options.headers.delete('Content-Type');
  // }

  public get(path: string, query = {}): any {
    const queryStr = query ? `?${qs.stringify(query)}` : '';
    const url = `${environment.apiUrl}/${path}${queryStr}`;
    console.log(environment.apiUrl);
    console.log(url);
    return this.http.get<any[]>(url, { ...this.options }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  post(path: string, params = {}): any {
    return this.http
      .post<any[]>(`${environment.apiUrl}/${path}`, params, { ...this.options })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  put(path: string, params = {}): any {
    return this.http
      .put<any[]>(`${environment.apiUrl}/${path}`, params, { ...this.options })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  delete(path: string): any {
    return this.http
      .delete<any[]>(`${environment.apiUrl}/${path}`, { ...this.options })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  // // public getHoikutasu(path: string): any {
  // //   const url = `${environment.hoikutasuBackendUrl}/${path}`;
  // //   return this.httpBackend.handle(new HttpRequest('GET', url));
  // // }

  protected handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(() => error);
  }
}
