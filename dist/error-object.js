"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorObject {
    constructor(code) {
        this.message = ErrorObject.errorMessages[code];
        if (!this.message) {
            throw new Error("Invalid error code");
        }
        this.code = code;
    }
}
ErrorObject.errorMessages = {
    EMPTY_USERNAME: 'Empty username',
    EMPTY_PASSWORD: 'Empty password',
    INVALID_USERNAME_OR_PASSWORD: 'Username and password combination not found!'
};
ErrorObject.EMPTY_USERNAME = 'EMPTY_USERNAME';
ErrorObject.EMPTY_PASSWORD = 'EMPTY_PASSWORD';
ErrorObject.INVALID_USERNAME_OR_PASSWORD = 'INVALID_USERNAME_OR_PASSWORD';
exports.ErrorObject = ErrorObject;
//# sourceMappingURL=error-object.js.map