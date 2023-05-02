"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorHandler = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = require("jsonwebtoken");
const routing_controllers_1 = require("routing-controllers");
const constants_1 = require("../utils/constants");
let AuthErrorHandler = class AuthErrorHandler {
    error(error, req, res, next) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(constants_1.UNAUTHORIZED_ERR_CODE).send({ message: constants_1.BAD_TOKEN });
            return;
        }
        next(error);
    }
};
AuthErrorHandler = tslib_1.__decorate([
    (0, routing_controllers_1.Middleware)({ type: 'after', priority: 1 })
], AuthErrorHandler);
exports.AuthErrorHandler = AuthErrorHandler;
//# sourceMappingURL=AuthErrorHandler.js.map