"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const UserModel_1 = tslib_1.__importDefault(require("../models/UserModel"));
const bcrypt_1 = tslib_1.__importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
let AuthController = class AuthController {
    signin({ email, password }, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const find = yield UserModel_1.default.findOne({ email: email.toLowerCase() }).select('+password').exec();
            if (find == null) {
                throw new routing_controllers_1.BadRequestError(constants_1.AUTH_ERROR);
            }
            const match = yield bcrypt_1.default.compare(password, String(find === null || find === void 0 ? void 0 : find.password));
            if (!match) {
                throw new routing_controllers_1.BadRequestError(constants_1.AUTH_ERROR);
            }
            const token = jsonwebtoken_1.default.sign({ id: find.id }, constants_1.JWT_SECRET, { expiresIn: '7d' });
            return { token };
        });
    }
    signup({ name, email, password, login }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            email = email.toLowerCase();
            login = login.toLowerCase();
            const find = yield UserModel_1.default.findOne({ $or: [{ email }, { login }] })
                .select('+email')
                .exec();
            if (find != null) {
                throw new routing_controllers_1.BadRequestError(`Пользователь уже существует с ${email === find.email ? 'такой почтой' : 'таким логином'}`);
            }
            const hashedPass = yield bcrypt_1.default.hash(password, 10);
            const user = new UserModel_1.default({ name, email, password: hashedPass, login });
            yield user.validate();
            yield user.save();
            return user;
        });
    }
};
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/signin'),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__param(1, (0, routing_controllers_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Response]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)('/signup'),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
AuthController = tslib_1.__decorate([
    (0, routing_controllers_1.JsonController)('', { transformResponse: false })
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map