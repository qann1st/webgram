import { BadRequestError, Body, HeaderParam, JsonController, Post, Res } from 'routing-controllers';
import UserModel, { IUser } from '../models/UserModel';
import bcrypt from 'bcrypt';
import { AUTH_ERROR, JWT_SECRET } from '../utils/constants';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

@JsonController('', { transformResponse: false })
export class AuthController {
  @Post('/signin')
  private async signin(@Body() { email, password }: IUser, @Res() res: Response) {
    const find = await UserModel.findOne({ email: email.toLowerCase() }).select('+password').exec();

    if (find == null) {
      throw new BadRequestError(AUTH_ERROR);
    }

    const match = await bcrypt.compare(password, String(find?.password));
    if (!match) {
      throw new BadRequestError(AUTH_ERROR);
    }

    const token = jwt.sign({ id: find.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      maxAge: 604800000,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { token };
  }

  @Post('/signup')
  private async signup(@Body() { name, email, password, login }: IUser) {
    email = email.toLowerCase();
    login = login.toLowerCase();
    const find = await UserModel.findOne({ $or: [{ email }, { login }] })
      .select('+email')
      .exec();
    if (find != null) {
      throw new BadRequestError(
        `Пользователь уже существует с ${email === find.email ? 'такой почтой' : 'таким логином'}`,
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPass, login });
    await user.validate();
    await user.save();

    return user;
  }
}
