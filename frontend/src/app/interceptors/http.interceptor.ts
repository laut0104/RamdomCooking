import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private userSvc: UserService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let headers = req.headers;
    const user = this.userSvc.user$.getValue();
    const authToken = this.userSvc.jwt$.getValue();

    if (environment.ngrokSkipBrowserWarning)
      headers = headers.set('ngrok-skip-browser-warning', 'skip');

    if (user?.id) headers = headers.set('user_id', String(user.id));

    if (authToken)
      headers = headers.set('Authorization', `Bearer ${authToken}`);

    const request = req.clone({ headers: headers });

    return next.handle(request);
  }
}
