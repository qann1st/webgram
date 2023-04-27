import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createExpressServer } from 'routing-controllers';
import { MONGODB_URL, PORT } from './utils/constants';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { AuthController } from './controllers/AuthController';

dotenv.config();

async function start(): Promise<void> {
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGODB_URL);

  const app = createExpressServer({
    cors: true,
    middlewares: [],
    controllers: [AuthController],
    defaultErrorHandler: false,
    validation: true,
  });

  const server = app.listen(PORT, () => console.log(`Running on port ${PORT}`));

  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    socket.on('msg', (data) => {
      console.log(data);
      socket.emit('msg', 'zhopa');
    });
  });
}

start().catch((err) => console.log(err));
