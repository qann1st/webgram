"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpErrorHandler = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
let HttpErrorHandler = class HttpErrorHandler {
    error(error, req, res, next) {
        if (error instanceof routing_controllers_1.HttpError) {
            res.status(error.httpCode).send({ message: error.message });
            return;
        }
        next(error);
    }
};
HttpErrorHandler = tslib_1.__decorate([
    (0, routing_controllers_1.Middleware)({ type: 'after', priority: 10 })
], HttpErrorHandler);
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map