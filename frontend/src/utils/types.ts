export interface IUser {
  _id: string;
  name: string;
  login?: string;
  avatar: string;
}

export interface IMessage {
  _id?: string;
  owner: IUser;
  text: string;
  roomId?: string;
  timestamp: number;
}
