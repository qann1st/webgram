import { Get, JsonController, Params } from 'routing-controllers';
import MessageModel from '../models/MessageModel';

@JsonController('/messages', { transformResponse: false })
export class MessagesController {
  @Get('/:roomId')
  private async getRoomMessages(@Params() { roomId }: { roomId: string }) {
    const messages = await MessageModel.find({ roomId });
    return messages;
  }

  @Get('/last/:roomId')
  private async getLastMessage(@Params() { roomId }: { roomId: string }) {
    const messages = await MessageModel.find({ roomId });

    return messages !== undefined ? messages[messages.length - 1] : '';
  }
}
