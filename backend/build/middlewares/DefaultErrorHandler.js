"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultErrorHandler = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const constants_1 = require("../utils/constants");
let DefaultErrorHandler = class DefaultErrorHandler {
    error(error, req, res, next) {
        res.status(constants_1.INTERNAL_SERVER_ERR_CODE).send({ message: constants_1.INTERNAL_ERROR });
    }
};
DefaultErrorHandler = tslib_1.__decorate([
    (0, routing_controllers_1.Middleware)({ type: 'after', priority: -1000 })
], DefaultErrorHandler);
exports.DefaultErrorHandler = DefaultErrorHandler;
//# sourceMappingURL=DefaultErrorHandler.js.map