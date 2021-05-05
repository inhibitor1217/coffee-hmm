"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.UserState = void 0;
const typeorm_1 = require("typeorm");
const policy_1 = __importDefault(require("./policy"));
const userProfile_1 = __importDefault(require("./userProfile"));
var UserState;
(function (UserState) {
    UserState[UserState["active"] = 0] = "active";
    UserState[UserState["deleted"] = 1] = "deleted";
})(UserState = exports.UserState || (exports.UserState = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider[AuthProvider["google"] = 0] = "google";
    AuthProvider[AuthProvider["custom"] = 10] = "custom";
})(AuthProvider = exports.AuthProvider || (exports.AuthProvider = {}));
let User = User_1 = class User {
    get stateString() {
        return UserState[this.state];
    }
    get providerString() {
        return AuthProvider[this.provider];
    }
    toJsonObject() {
        var _a, _b;
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            lastSignedAt: (_b = (_a = this.lastSignedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
            userProfileId: this.fkUserProfileId,
            policyId: this.fkPolicyId,
            state: this.stateString,
            provider: this.providerString,
            providerUserId: this.providerUserId,
            providerUserEmail: this.providerUserEmail,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(User_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(User_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            lastSignedAt: raw[rawColumnName('last_signed_at')],
            fkUserProfileId: raw[rawColumnName('fk_user_profile_id')],
            fkPolicyId: raw[rawColumnName('fk_policy_id')],
            state: raw[rawColumnName('state')],
            provider: raw[rawColumnName('provider')],
            providerUserId: raw[rawColumnName('provider_uid')],
            providerUserEmail: raw[rawColumnName('provider_email')],
        });
    }
};
User.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'lastSignedAt',
    'fkUserProfileId',
    'fkPolicyId',
    'state',
    'provider',
    'providerUserId',
    'providerUserEmail',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamptz', name: 'last_signed_at', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "lastSignedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_user_profile_id' }),
    __metadata("design:type", String)
], User.prototype, "fkUserProfileId", void 0);
__decorate([
    typeorm_1.OneToOne(() => userProfile_1.default),
    typeorm_1.JoinColumn({ name: 'fk_user_profile_id' }),
    __metadata("design:type", userProfile_1.default)
], User.prototype, "profile", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_policy_id' }),
    __metadata("design:type", String)
], User.prototype, "fkPolicyId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => policy_1.default),
    typeorm_1.JoinColumn({ name: 'fk_policy_id' }),
    __metadata("design:type", policy_1.default)
], User.prototype, "policy", void 0);
__decorate([
    typeorm_1.Column({ type: 'int2', name: 'state' }),
    __metadata("design:type", Number)
], User.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({ type: 'int2', name: 'provider' }),
    __metadata("design:type", Number)
], User.prototype, "provider", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'provider_uid', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "providerUserId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        name: 'provider_email',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], User.prototype, "providerUserEmail", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity('users'),
    typeorm_1.Unique('idx_provider', ['provider', 'providerUserId']),
    typeorm_1.Index('idx_updated_at', ['updatedAt']),
    typeorm_1.Index('idx_policy_id', ['fkPolicyId']),
    typeorm_1.Index('idx_state', ['state'])
], User);
exports.default = User;
