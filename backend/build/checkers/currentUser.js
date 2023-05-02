"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const routing_controllers_1 = require("routing-controllers");
const UserModel_1 = tslib_1.__importDefault(require("../models/UserModel"));
const constants_1 = require("../utils/constants");
const currentUserChecker = (action) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let payload;
    const authorization = action.request.headers.authorization;
    if (action.request.user !== undefined) {
        payload = action.request.user;
    }
    else if (authorization === undefined) {
        throw new routing_controllers_1.UnauthorizedError(constants_1.AUTH_REQUIRED);
    }
    else if (!authorization.startsWith('Bearer ')) {
        throw new routing_controllers_1.UnauthorizedError(constants_1.BAD_TOKEN_TYPE);
    }
    else {
        const token = authorization.replace('Bearer ', '');
        payload = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '', { complete: true })
            .payload;
    }
    const user = yield UserModel_1.default.findById(payload.id).select('+email').exec();
    if (user === null) {
        throw new routing_controllers_1.ForbiddenError(constants_1.USER_NOT_FOUND);
    }
    return user;
});
exports.default = currentUserChecker;
//# sourceMappingURL=currentUser.js.map