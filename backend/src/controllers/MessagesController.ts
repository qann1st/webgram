import { Response } from 'express';
import { Get, JsonController, Params, Res } from 'routing-controllers';
import MessageModel from '../models/MessageModel';

@JsonController('/messages', { transformResponse: false })
export class MessagesController {
  @Get('/:roomId')
  private async getRoomMessages(@Params() { roomId, page }: { roomId: string; page: number }) {
    const messages = await MessageModel.find({ roomId });
    return messages;
  }

  @Get('/last/:roomId')
  private async getLastMessage(@Params() { roomId }: { roomId: string }, @Res() res: Response) {
    const messages = await MessageModel.find({ roomId });

    if (messages.length === 0) {
      res.status(200);
      return 'Пока сообщений нет';
    }
    return messages[messages.length - 1];
  }
}
