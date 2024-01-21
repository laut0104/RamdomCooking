import { HttpResponseBase } from '@angular/common/http';

export namespace AppError {
  export function isInstance(error: BaseError, className: string) {
    return error.name && error.name === className;
  }

  export class BaseError extends Error {
    constructor(message?: string, error?: Error) {
      super(message);
      this.name = 'AppError.BaseError';
      this.message = message || 'An error occurred';
      if (error) {
        this.stack += `\nCaused by: ${error.message}`;
        if (error.stack) {
          this.stack += `\n${error.stack}`;
        }
      }
    }
  }

  export class ApiError extends BaseError {
    private response?: HttpResponseBase;

    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, error);
      this.name = 'ApiError';
      this.response = response;
    }
  }

  export class BadRequest extends ApiError {
    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, response);
      this.name = 'BadRequest';
    }
  }

  export class Unauthorized extends ApiError {
    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, response);
      this.name = 'Unauthorized';
    }
  }

  export class Forbidden extends ApiError {
    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, response);
      this.name = 'Forbidden';
    }
  }

  export class ServerError extends ApiError {
    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, response);
      this.name = 'ServerError';
    }
  }
  export class Maintenance extends ApiError {
    constructor(message?: string, response?: HttpResponseBase, error?: Error) {
      super(message, response);
      this.name = 'Maintenance';
    }
  }

  export class ApiErrorFactory {
    public static getError(res: HttpResponseBase): ApiError | null {
      let error: ApiError | null = null;
      switch (res.status) {
        case 400:
          error = new AppError.BadRequest(undefined, res);
          break;
        case 401:
          error = new AppError.Unauthorized(undefined, res);
          break;
        case 403:
          error = new AppError.Forbidden(undefined, res);
          break;
        case 500:
          error = new AppError.ServerError(undefined, res);
          break;
        case 503:
          error = new AppError.Maintenance(undefined, res);
          break;
      }
      return error;
    }
  }
}
