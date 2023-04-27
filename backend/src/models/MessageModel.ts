import mongoose from 'mongoose';

export interface IMessage {
  owner: string;
  text: string;
  roomId: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  owner: {
    type: String,
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
});

export default mongoose.model<IMessage>('Message', messageSchema);
