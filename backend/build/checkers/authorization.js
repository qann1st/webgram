"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const routing_controllers_1 = require("routing-controllers");
const constants_1 = require("../utils/constants");
const AuthorizationChecker = (action) => {
    var _a;
    const authorization = action.request.headers.authorization;
    if (authorization === undefined) {
        throw new routing_controllers_1.UnauthorizedError(constants_1.AUTH_REQUIRED);
    }
    if (!authorization.startsWith('Bearer ')) {
        throw new routing_controllers_1.UnauthorizedError(constants_1.BAD_TOKEN_TYPE);
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '', { complete: true })
        .payload;
    action.request.user = payload;
    return true;
};
exports.default = AuthorizationChecker;
//# sourceMappingURL=authorization.js.map