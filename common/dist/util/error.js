"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionCode = void 0;
var ExceptionCode;
(function (ExceptionCode) {
    ExceptionCode[ExceptionCode["invalidArgument"] = 0] = "invalidArgument";
    ExceptionCode[ExceptionCode["notImplemented"] = 1] = "notImplemented";
    ExceptionCode[ExceptionCode["badRequest"] = 2] = "badRequest";
    ExceptionCode[ExceptionCode["unauthorized"] = 3] = "unauthorized";
    ExceptionCode[ExceptionCode["forbidden"] = 4] = "forbidden";
    ExceptionCode[ExceptionCode["notFound"] = 5] = "notFound";
    ExceptionCode[ExceptionCode["service"] = 6] = "service";
})(ExceptionCode = exports.ExceptionCode || (exports.ExceptionCode = {}));
class Exception extends Error {
    constructor(code, payload) {
        super(`[${ExceptionCode[code].toUpperCase()}] ${JSON.stringify(payload)}`);
        this.code = code;
        this.payload = payload;
    }
    static isException(err) {
        return err instanceof Exception;
    }
    static isExceptionOf(err, code) {
        return this.isException(err) && err.code === code;
    }
}
exports.default = Exception;
