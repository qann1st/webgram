import mongoose from 'mongoose';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { MONGODB_URL, PORT } from './utils/constants';
import { Server } from 'socket.io';
import { AuthController } from './controllers/AuthController';
import authorizationChecker from './checkers/authorization';
import { AuthErrorHandler } from './middlewares/AuthErrorHandler';
import { HttpErrorHandler } from './middlewares/HttpErrorHandler';
import { DefaultErrorHandler } from './middlewares/DefaultErrorHandler';
import currentUserChecker from './checkers/currentUser';
import { UsersController } from './controllers/UsersController';
import MessageModel, { IMessage } from './models/MessageModel';
import { MessagesController } from './controllers/MessagesController';
import UserModel from './models/UserModel';

async function start(): Promise<void> {
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGODB_URL);

  const app = createExpressServer({
    cors: true,
    middlewares: [AuthErrorHandler, DefaultErrorHandler, HttpErrorHandler],
    controllers: [AuthController, UsersController, MessagesController],
    authorizationChecker,
    currentUserChecker,
    defaultErrorHandler: false,
    validation: true,
  });

  const server = app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', async (socket) => {
    if (socket.handshake.query.params) {
      console.log(socket.handshake.query.params);
      await UserModel.findByIdAndUpdate(
        socket.handshake.query.params,
        { isOnline: true },
        { new: true, runValidators: true },
      );
    }

    socket.on('join', ({ roomId }: { roomId: string }) => {
      socket.join(roomId);
    });

    socket.on('message', async ({ owner, text, roomId }: IMessage) => {
      const timestamp = new Date();
      const message: IMessage = await MessageModel.create({ owner, text, roomId, timestamp });
      socket.to(roomId).emit('message', message);
      socket.emit('message', message);
    });

    socket.on('disconnect', async () => {
      if (socket.handshake.query.params) {
        await UserModel.findByIdAndUpdate(
          socket.handshake.query.params,
          { isOnline: false },
          { new: true, runValidators: true },
        );
      }
    });

    socket.on('leave', ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
    });
  });
}

start().catch((err) => console.log(err));
