import jwt, { JwtPayload } from 'jsonwebtoken';
import { Action, UnauthorizedError } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';
import { AUTH_REQUIRED, BAD_TOKEN_TYPE } from '../utils/constants';

const AuthorizationChecker: AuthorizationChecker = (action: Action) => {
  const authorization = action.request.headers.authorization as string;

  if (authorization === undefined) {
    throw new UnauthorizedError(AUTH_REQUIRED);
  }
  if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(BAD_TOKEN_TYPE);
  }

  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET ?? '', { complete: true })
    .payload as JwtPayload;

  action.request.user = payload;
  return true;
};

export default AuthorizationChecker;
