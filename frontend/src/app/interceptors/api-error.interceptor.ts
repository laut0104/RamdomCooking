import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppError } from '../error/api-error';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router // private alertService: AppAlertService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.reportProgress) {
      throw new AppError.BaseError('not implements');
    }
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const err = this.handleAppError(event);
          if (err) {
            throw err;
          }
        }
        return event;
      }),
      catchError((errRes: HttpErrorResponse) => {
        if (errRes.error instanceof ErrorEvent) {
          const message = `An error occurred: ${errRes.error.message}`;
          this.errorLog(message);
        } else {
          const err = this.handleAppError(errRes);
          if (err) {
            throw err;
          }
        }
        return throwError(errRes);
      })
    );
  }

  private handleAppError(event: HttpResponseBase) {
    const err = AppError.ApiErrorFactory.getError(event);
    console.log(err);
    if (err === null) {
      return err;
    }
    if (AppError.isInstance(err, 'Unauthorized')) {
      this.errorLog(err);
      // localStorage.clear();
      // window.location.reload();
      this.router.navigate(['/401'], { skipLocationChange: true });
      return null;
    }
    if (AppError.isInstance(err, 'ServerError')) {
      this.errorLog(err);
      //this.storageSvc.clear();
      // window.location.replace(`${environment.baseUrl}/server-error`);
      this.router.navigate(['/500']);
      return null;
    }
    if (AppError.isInstance(err, 'NotFound')) {
      this.errorLog(err);
      this.router.navigate(['/404']);
      return null;
    }
    return err;
  }

  private errorLog(message: string | Error) {
    if (message instanceof Error) {
      const err = message;
      message = `${err.message}: ${err.stack}`;
    }
    console.error(message);
  }
}
