"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperationTypeString = exports.OperationType = exports.OperationSchema = exports.generateRootPolicy = exports.generateDefaultUserPolicy = exports.IamPolicy = exports.IamRule = void 0;
var rule_1 = require("./rule");
Object.defineProperty(exports, "IamRule", { enumerable: true, get: function () { return __importDefault(rule_1).default; } });
var policy_1 = require("./policy");
Object.defineProperty(exports, "IamPolicy", { enumerable: true, get: function () { return __importDefault(policy_1).default; } });
Object.defineProperty(exports, "generateDefaultUserPolicy", { enumerable: true, get: function () { return policy_1.generateDefaultUserPolicy; } });
Object.defineProperty(exports, "generateRootPolicy", { enumerable: true, get: function () { return policy_1.generateRootPolicy; } });
var schema_1 = require("./schema");
Object.defineProperty(exports, "OperationSchema", { enumerable: true, get: function () { return __importDefault(schema_1).default; } });
var OperationType;
(function (OperationType) {
    OperationType[OperationType["query"] = 0] = "query";
    OperationType[OperationType["mutation"] = 1] = "mutation";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
const isOperationTypeString = (str) => str === 'query' || str === 'mutation';
exports.isOperationTypeString = isOperationTypeString;
