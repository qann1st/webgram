import { Error, HydratedDocument } from 'mongoose';
import {
  Authorized,
  BadRequestError,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Patch,
} from 'routing-controllers';
import UserModel, { IUser } from '../models/UserModel';

@JsonController('/users', { transformResponse: false })
export class UsersController {
  @Get('/me')
  private async getUserMe(@CurrentUser() user: HydratedDocument<IUser>) {
    return user;
  }

  @Patch('/me')
  private async patchUserMe(
    @CurrentUser() user: HydratedDocument<IUser>,
    @Body() { name, login, avatar }: IUser,
  ) {
    if (login !== undefined && user.login !== login) {
      const checkLogin = await UserModel.findOne({ login }).exec();

      if (checkLogin !== undefined && checkLogin !== null)
        throw new BadRequestError('Такой логин уже используется');
    }

    let updated;

    try {
      updated = await UserModel.findOneAndUpdate(
        { _id: user.id },
        { name, login, avatar },
        { new: true, runValidators: true },
      ).exec();
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestError(e.message);
      }
    }

    if (updated !== undefined && updated !== null) {
      return updated;
    }

    throw new BadRequestError('Пользователь не найден');
  }

  @Authorized(['user'])
  @Get('')
  private async getUsers() {
    const users = await UserModel.find({});
    return users;
  }
}
