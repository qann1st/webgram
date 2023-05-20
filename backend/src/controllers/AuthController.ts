import {
  BadRequestError,
  Body,
  CurrentUser,
  JsonController,
  Params,
  Post,
  Req,
  Res,
} from 'routing-controllers';
import UserModel, { IUser } from '../models/UserModel';
import bcrypt from 'bcrypt';
import { AUTH_ERROR, JWT_SECRET } from '../utils/constants';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
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

    const token = jwt.sign({ id: find.id }, JWT_SECRET);

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

  @Post('/reset-password/:id')
  private async resetPassword(
    @Body()
    {
      email,
      newPassword,
      randomToken,
    }: { email: string; newPassword: string; randomToken: string },
    @Params() { id }: { id: string },
    @Req() req: any,
  ) {
    const hashedPass = await bcrypt.hash(newPassword, 10);

    if (id === randomToken) {
      const updated = await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPass },
        { new: true, runValidators: true },
      )
        .select('+password')
        .exec();
      return updated;
    }
  }

  @Post('/forgot-password')
  private async forgotPassword(@Body() { email }: IUser, @Res() res: Response, @Req() req: any) {
    const findEmail = await UserModel.find({ email });
    if (findEmail[0]) {
      const randomToken = uuidv4();
      const pass = process.env.EMAIL_PASSWORD;

      const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 587,
        secure: false,
        auth: {
          user: 'webgram@mail.ru',
          pass,
        },
      });

      const mailOptions = {
        from: 'Webgram Support <webgram@mail.ru> ',
        to: email,
        subject: 'Восстановление пароля',
        html: `<p>Чтобы восстановить пароль, перейдите по ссылке:</p> <p><a href="https://webgram-three.vercel.app/reset-password/${randomToken}">Восстановить пароль</a></p>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);

          return 'Ошибка';
        } else {
          return 'Email sent: ' + info.response;
        }
      });
      res.status(200);
      return randomToken;
    } else {
      res.status(404);
      return { message: 'Такого пользователя не существует' };
    }
  }
}
