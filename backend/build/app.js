"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const constants_1 = require("./utils/constants");
const socket_io_1 = require("socket.io");
const AuthController_1 = require("./controllers/AuthController");
const authorization_1 = tslib_1.__importDefault(require("./checkers/authorization"));
const AuthErrorHandler_1 = require("./middlewares/AuthErrorHandler");
const HttpErrorHandler_1 = require("./middlewares/HttpErrorHandler");
const DefaultErrorHandler_1 = require("./middlewares/DefaultErrorHandler");
const currentUser_1 = tslib_1.__importDefault(require("./checkers/currentUser"));
const UsersController_1 = require("./controllers/UsersController");
const MessageModel_1 = tslib_1.__importDefault(require("./models/MessageModel"));
const MessagesController_1 = require("./controllers/MessagesController");
dotenv_1.default.config();
function start() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        mongoose_1.default.set('strictQuery', false);
        yield mongoose_1.default.connect(constants_1.MONGODB_URL);
        const app = (0, routing_controllers_1.createExpressServer)({
            cors: { origin: 'https://webgram-three.vercel.app' },
            middlewares: [AuthErrorHandler_1.AuthErrorHandler, DefaultErrorHandler_1.DefaultErrorHandler, HttpErrorHandler_1.HttpErrorHandler],
            controllers: [AuthController_1.AuthController, UsersController_1.UsersController, MessagesController_1.MessagesController],
            authorizationChecker: authorization_1.default,
            currentUserChecker: currentUser_1.default,
            defaultErrorHandler: false,
            validation: true,
        });
        const server = app.listen(constants_1.PORT, () => console.log(`Running on port ${constants_1.PORT}`));
        const io = new socket_io_1.Server(server, { cors: { origin: 'https://webgram-three.vercel.app' } });
        io.on('connection', (socket) => {
            socket.on('join', ({ roomId }) => {
                socket.join(roomId);
            });
            socket.on('message', ({ owner, text, roomId }) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const timestamp = new Date();
                const message = yield MessageModel_1.default.create({ owner, text, roomId, timestamp });
                socket.to(roomId).emit('message', message);
                socket.emit('message', message);
            }));
            socket.on('leave', ({ roomId }) => {
                socket.leave(roomId);
            });
        });
    });
}
start().catch((err) => console.log(err));
//# sourceMappingURL=app.js.map