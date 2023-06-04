import mongoose from 'mongoose';

export interface IUser {
  _id?: string;
  name?: string;
  login?: string;
  avatar?: string;
}

export interface IMessage {
  owner: IUser;
  text?: string;
  roomId: string;
  duration?: number;
  timestamp: number;
  audio?: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  owner: {
    type: Object,
    required: true,
  },
  text: {
    type: String,
    minLength: 1,
  },
  audio: {
    type: String,
  },
  duration: {
    type: Number,
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
