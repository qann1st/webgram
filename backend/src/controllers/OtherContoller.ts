import { Controller, Get, Param, Res } from 'routing-controllers';
import { Response } from 'express';
import * as fs from 'fs';

@Controller()
export class OtherController {
  @Get('/:id')
  public async getAudioFile(@Param('id') id: string, @Res() res: Response) {
    res.set('Content-Type', 'audio/wav');
    const filePath = __dirname + '/' + id;
    const fileContent = fs.readFileSync(filePath);
    return res.send(fileContent);
  }
}
