import { Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { INTERNAL_ERROR, INTERNAL_SERVER_ERR_CODE } from '../utils/constants';

@Middleware({ type: 'after', priority: -1000 })
export class DefaultErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: Error, req: any, res: Response, next: (err?: any) => any): void {
    res.status(INTERNAL_SERVER_ERR_CODE).send({ message: INTERNAL_ERROR });
  }
}
