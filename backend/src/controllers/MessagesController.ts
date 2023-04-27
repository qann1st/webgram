import { Body, Get, JsonController } from 'routing-controllers';
import MessageModel from '../models/MessageModel';

@JsonController('/messages', { transformResponse: false })
export class MessagesController {
  @Get()
  private getRoomMessages(@Body() { roomId }: { roomId: string }) {
    const messages = MessageModel.find({ roomId });
    return messages;
  }
}
