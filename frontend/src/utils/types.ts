export interface IUser {
  _id: string;
  name: string;
  login?: string;
  avatar: string;
  isOnline: boolean;
  lastOnline: number;
}

export interface IMessage {
  _id: string;
  owner: IUser;
  text: string;
  roomId?: string;
  timestamp: number;
  audio: string;
  duration: number;
}

export enum Months {
  января = 1,
  февраля = 2,
  марта = 3,
  апреля = 4,
  мая = 5,
  июня = 6,
  июля = 7,
  августа = 8,
  сентября = 9,
  октября = 10,
  ноября = 11,
  декабря = 12,
}
