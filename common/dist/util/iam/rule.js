"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const ANY_WORD = '*';
const MATCH_UID = '[uid]';
class IamRule {
    constructor(params) {
        var _a;
        this.operationType = params.operationType;
        this.operation = params.operation;
        this.resource = (_a = params.resource) !== null && _a !== void 0 ? _a : ANY_WORD;
    }
    toJsonObject() {
        return {
            operationType: _1.OperationType[this.operationType],
            operation: this.operation,
            resource: this.resource,
        };
    }
    compareOperationHierarchy(allowed, requesting) {
        const [allowedFirst, ...allowedRest] = allowed;
        const [requestingFirst, ...requestingRest] = requesting;
        if (!allowedFirst && !requestingFirst) {
            return true;
        }
        return (allowedFirst === ANY_WORD ||
            (allowedFirst === requestingFirst &&
                this.compareOperationHierarchy(allowedRest, requestingRest)));
    }
    compareOperation(allowed, requesting) {
        return this.compareOperationHierarchy(allowed.split('.'), requesting.split('.'));
    }
    canExecuteOperation(state, schema) {
        return (this.operationType === schema.operationType &&
            this.compareOperation(this.operation, schema.operation) &&
            (this.resource === ANY_WORD ||
                (this.resource === MATCH_UID && schema.resource === state.uid) ||
                this.resource === schema.resource));
    }
    static isValidRuleJsonObject(json) {
        if (json === null || typeof json !== 'object' || Array.isArray(json)) {
            return false;
        }
        const { operationType, operation, resource } = json;
        if (typeof operationType !== 'string' ||
            !_1.isOperationTypeString(operationType)) {
            return false;
        }
        if (typeof operation !== 'string' || operation.length === 0) {
            return false;
        }
        if (typeof resource !== 'string' && typeof resource !== 'undefined') {
            return false;
        }
        return true;
    }
    static fromJsonObject(json) {
        var _a;
        return new IamRule({
            operationType: _1.OperationType[json.operationType],
            operation: json.operation,
            resource: (_a = json.resource) !== null && _a !== void 0 ? _a : ANY_WORD,
        });
    }
}
exports.default = IamRule;
