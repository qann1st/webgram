"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const MessageModel_1 = tslib_1.__importDefault(require("../models/MessageModel"));
let MessagesController = class MessagesController {
    getRoomMessages({ roomId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const messages = yield MessageModel_1.default.find({ roomId });
            return messages;
        });
    }
    getLastMessage({ roomId }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const messages = yield MessageModel_1.default.find({ roomId });
            return messages[messages.length - 1];
        });
    }
};
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/:roomId'),
    tslib_1.__param(0, (0, routing_controllers_1.Params)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessagesController.prototype, "getRoomMessages", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/last/:roomId'),
    tslib_1.__param(0, (0, routing_controllers_1.Params)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MessagesController.prototype, "getLastMessage", null);
MessagesController = tslib_1.__decorate([
    (0, routing_controllers_1.JsonController)('/messages', { transformResponse: false })
], MessagesController);
exports.MessagesController = MessagesController;
//# sourceMappingURL=MessagesController.js.map