import jwt, { JwtPayload } from 'jsonwebtoken';
import { Action, ForbiddenError, UnauthorizedError } from 'routing-controllers';
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import UserModel from '../models/UserModel';
import { AUTH_REQUIRED, BAD_TOKEN_TYPE, USER_NOT_FOUND, JWT_SECRET } from '../utils/constants';

const currentUserChecker: CurrentUserChecker = async (action: Action) => {
  let payload;
  const authorization = action.request.headers.authorization as string;

  if (action.request.user !== undefined) {
    payload = action.request.user;
  } else if (authorization === undefined) {
    throw new UnauthorizedError(AUTH_REQUIRED);
  } else if (!authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(BAD_TOKEN_TYPE);
  } else {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET, { complete: true }).payload as JwtPayload;
  }

  const user = await UserModel.findById(payload.id).select('+email').exec();
  if (user === null) {
    throw new ForbiddenError(USER_NOT_FOUND);
  }

  return user;
};

export default currentUserChecker;
