"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class OperationSchema {
    constructor(params) {
        this.operationType = params.operationType;
        this.operation = params.operation;
        this.resource = params.resource;
    }
    toJsonObject() {
        return {
            operationType: _1.OperationType[this.operationType],
            operation: this.operation,
            resource: this.resource,
        };
    }
}
exports.default = OperationSchema;
