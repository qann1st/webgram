import { Get, JsonController, Params } from 'routing-controllers';
import MessageModel from '../models/MessageModel';

@JsonController('/messages', { transformResponse: false })
export class MessagesController {
  @Get('/:roomId')
  private getRoomMessages(@Params() { roomId }: { roomId: string }) {
    const messages = MessageModel.find({ roomId });
    return messages;
  }
}
