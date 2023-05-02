"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const routing_controllers_1 = require("routing-controllers");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 16,
    },
    login: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 16,
        validate: [
            function (v) {
                return /^[a-zA-Z\d]+$/.test(v);
            },
            ({ value }) => `${value} is not a valid login`,
        ],
    },
    avatar: {
        type: String,
        required: true,
        default: 'https://kartinkin.net/pics/uploads/posts/2022-09/thumbs/1662405711_5-kartinkin-net-p-ikonka-cheloveka-minimalizm-vkontakte-5.png',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        select: false,
        validate: [
            function (v) {
                return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(v);
            },
            ({ value }) => `${value} is not a valid email`,
        ],
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
});
userSchema.static('findUserByIdOrLogin', function (findValue) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let findUser = null;
        if ((0, mongoose_1.isValidObjectId)(findValue)) {
            findUser = yield this.findById(findValue);
        }
        else if (typeof findValue === 'string') {
            findUser = yield this.findOne({ login: findValue.toLocaleLowerCase() });
        }
        if (findUser === null) {
            throw new routing_controllers_1.BadRequestError('User not found');
        }
        return findUser;
    });
});
exports.default = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=UserModel.js.map