import mongoose, { isValidObjectId, Model, RefType } from 'mongoose';
import { BadRequestError } from 'routing-controllers';

export interface IUser {
  name: string;
  login: string;
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser> {
  findUserByIdOrLogin: (findValue: RefType) => any;
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 16,
  },
  login: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 16,
    validate: [
      function (v: string) {
        return /^[a-zA-Z\d]+$/.test(v);
      },
      ({ value }: { value: string }) => `${value} is not a valid login`,
    ],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
    validate: [
      function (v: string) {
        return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(v);
      },
      ({ value }: { value: string }) => `${value} is not a valid email`,
    ],
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
});

userSchema.static('findUserByIdOrLogin', async function (findValue: RefType) {
  let findUser = null;
  if (isValidObjectId(findValue)) {
    findUser = await this.findById(findValue);
  } else if (typeof findValue === 'string') {
    findUser = await this.findOne({ login: findValue.toLocaleLowerCase() });
  }

  if (findUser === null) {
    throw new BadRequestError('User not found');
  }
  return findUser;
});

export default mongoose.model<IUser, IUserModel>('User', userSchema);
