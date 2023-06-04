import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { BAD_TOKEN, UNAUTHORIZED_ERR_CODE } from '../utils/constants';

@Middleware({ type: 'after', priority: 1 })
export class AuthErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: Request, res: Response, next: (err?: Error) => Error): void {
    if (error instanceof JsonWebTokenError) {
      res.status(UNAUTHORIZED_ERR_CODE).send({ message: BAD_TOKEN });
      return;
    }
    next(error);
  }
}
