"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const UserModel_1 = tslib_1.__importDefault(require("../models/UserModel"));
let UsersController = class UsersController {
    getUserMe(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return user;
        });
    }
    patchUserMe(user, { name, login, avatar }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (login !== undefined && user.login !== login) {
                const checkLogin = yield UserModel_1.default.findOne({ login }).exec();
                if (checkLogin !== undefined && checkLogin !== null)
                    throw new routing_controllers_1.BadRequestError('Такой логин уже используется');
            }
            let updated;
            try {
                updated = yield UserModel_1.default.findOneAndUpdate({ _id: user.id }, { name, login, avatar }, { new: true, runValidators: true }).exec();
            }
            catch (e) {
                throw new routing_controllers_1.BadRequestError(e.message);
            }
            if (updated !== undefined && updated !== null) {
                return updated;
            }
            throw new routing_controllers_1.BadRequestError('User not found');
        });
    }
    getUsers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const users = yield UserModel_1.default.find({});
            return users;
        });
    }
};
tslib_1.__decorate([
    (0, routing_controllers_1.Get)('/me'),
    tslib_1.__param(0, (0, routing_controllers_1.CurrentUser)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getUserMe", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Patch)('/me'),
    tslib_1.__param(0, (0, routing_controllers_1.CurrentUser)()),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "patchUserMe", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Authorized)(['user']),
    (0, routing_controllers_1.Get)(''),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
UsersController = tslib_1.__decorate([
    (0, routing_controllers_1.JsonController)('/users', { transformResponse: false })
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=UsersController.js.map