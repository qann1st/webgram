import { Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers';

@Middleware({ type: 'after', priority: 10 })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: Request, res: Response, next: (err?: Error) => Error): void {
    if (error instanceof HttpError) {
      res.status(error.httpCode).send({ message: error.message });
      return;
    }
    next(error);
  }
}
