import { Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

@Middleware({ type: 'after', priority: 10 })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: any, res: Response, next: (err?: any) => any): void {
    if (error instanceof HttpError) {
      res.status(error.httpCode).send({ message: error.message });
      return;
    }
    next(error);
  }
}
