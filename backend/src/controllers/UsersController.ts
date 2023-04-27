import { Authorized, Get, JsonController } from 'routing-controllers';
import UserModel from 'src/models/UserModel';

@JsonController('/users', { transformResponse: false })
export class UsersController {
  @Authorized(['user'])
  @Get('')
  private async getUsers(): Promise<any> {
    const users = await UserModel.find({});
    console.log(users);

    return users;
  }
}
