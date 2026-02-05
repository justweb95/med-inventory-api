"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internal = exports.conflict = exports.badRequest = exports.notFound = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.HttpError = HttpError;
const notFound = (msg = 'Not found') => new HttpError(404, msg);
exports.notFound = notFound;
const badRequest = (msg = 'Bad request') => new HttpError(400, msg);
exports.badRequest = badRequest;
const conflict = (msg = 'Conflict') => new HttpError(409, msg);
exports.conflict = conflict;
const internal = (msg = 'Internal server error') => new HttpError(500, msg);
exports.internal = internal;
