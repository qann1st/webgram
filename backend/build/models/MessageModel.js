"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    owner: {
        type: Object,
        required: true,
    },
    text: {
        type: String,
        required: true,
        minLength: 1,
    },
    roomId: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose_1.default.model('Message', messageSchema);
//# sourceMappingURL=MessageModel.js.map