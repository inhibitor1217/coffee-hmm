"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRootPolicy = exports.generateDefaultUserPolicy = void 0;
const _1 = require(".");
const error_1 = __importStar(require("../error"));
class IamPolicy {
    constructor(params) {
        this.rules = params.rules;
    }
    toJsonObject() {
        return {
            rules: this.rules.map((rule) => rule.toJsonObject()),
        };
    }
    canExecuteOperation(state, schema) {
        return this.rules.some((rule) => rule.canExecuteOperation(state, schema));
    }
    canExecuteOperations(state, schemas) {
        return schemas.every((schema) => this.canExecuteOperation(state, schema));
    }
    static isValidPolicyJsonObject(json) {
        if (json === null || typeof json !== 'object' || Array.isArray(json)) {
            return false;
        }
        const { rules } = json;
        if (rules === null || typeof rules !== 'object' || !Array.isArray(rules)) {
            return false;
        }
        if (rules.length === 0) {
            return false;
        }
        if (!rules.every((rule) => _1.IamRule.isValidRuleJsonObject(rule))) {
            return false;
        }
        return true;
    }
    static fromJsonObject(json) {
        return new IamPolicy({
            rules: json.rules.map((rule) => _1.IamRule.fromJsonObject(rule)),
        });
    }
    static parse(raw) {
        try {
            const json = JSON.parse(raw);
            if (!this.isValidPolicyJsonObject(json)) {
                throw new error_1.default(error_1.ExceptionCode.invalidArgument, `invalid iam policy statement: got ${raw}`);
            }
            return this.fromJsonObject(json);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                throw new error_1.default(error_1.ExceptionCode.invalidArgument, e.message);
            }
            throw e;
        }
    }
}
exports.default = IamPolicy;
const generateDefaultUserPolicy = () => new IamPolicy({
    rules: [
        new _1.IamRule({
            operationType: _1.OperationType.query,
            operation: 'auth.user',
            resource: '[uid]',
        }),
        new _1.IamRule({
            operationType: _1.OperationType.mutation,
            operation: 'auth.user',
            resource: '[uid]',
        }),
        new _1.IamRule({
            operationType: _1.OperationType.query,
            operation: 'auth.user.profile',
            resource: '[uid]',
        }),
        new _1.IamRule({
            operationType: _1.OperationType.mutation,
            operation: 'auth.user.profile',
            resource: '[uid]',
        }),
        new _1.IamRule({
            operationType: _1.OperationType.query,
            operation: 'auth.user.policy',
            resource: '[uid]',
        }),
    ],
});
exports.generateDefaultUserPolicy = generateDefaultUserPolicy;
const generateRootPolicy = () => new IamPolicy({
    rules: [
        new _1.IamRule({ operationType: _1.OperationType.query, operation: '*' }),
        new _1.IamRule({ operationType: _1.OperationType.mutation, operation: '*' }),
    ],
});
exports.generateRootPolicy = generateRootPolicy;
