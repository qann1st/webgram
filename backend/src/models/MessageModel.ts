import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name?: string;
  login?: string;
  avatar?: string;
}

export interface IMessage {
  owner: IUser;
  text: string;
  roomId: string;
  timestamp: number;
}

const messageSchema = new mongoose.Schema<IMessage>({
  owner: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    required: true,
    minLength: 2,
  },
  roomId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IMessage>('Message', messageSchema);
