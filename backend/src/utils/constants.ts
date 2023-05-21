import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MONGODB_URL = process.env.MONGODB_URL ?? 'mongodb://localhost:27017/webgram';
export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecretkey';

export const CONFLICT_ERR_CODE = 409;
export const NOT_FOUND_ERR_CODE = 404;
export const FORBIDDEN_ERR_CODE = 403;
export const UNAUTHORIZED_ERR_CODE = 401;
export const BAD_REQUEST_ERR_CODE = 400;
export const INTERNAL_SERVER_ERR_CODE = 500;

export const USER_NOT_FOUND = 'Пользователь не найден';
export const PAGE_NOT_FOUND = 'Такого маршрута не существует';
export const USER_EXISTS = 'Такой пользователь уже существует';
export const AUTH_ERROR = 'Неверная почта или пароль';
export const AUTH_REQUIRED = 'Необходимо авторизоваться';
export const BAD_TOKEN = 'Неверный токен';
export const BAD_TOKEN_TYPE = 'Неверный тип токена';
export const INTERNAL_ERROR = 'Возможно произошла ошибка';
