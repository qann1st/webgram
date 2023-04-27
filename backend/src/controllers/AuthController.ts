import { BadRequestError, Body, JsonController, Post, Res } from 'routing-controllers';
import UserModel, { IUser } from '../models/UserModel';
import bcrypt from 'bcrypt';
import { AUTH_ERROR, JWT_SECRET } from 'src/utils/constants';
import jwt from 'jsonwebtoken';

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

    return { token };
  }
}
