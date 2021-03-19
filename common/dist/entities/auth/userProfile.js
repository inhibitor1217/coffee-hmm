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
var UserProfile_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let UserProfile = UserProfile_1 = class UserProfile {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            name: this.name,
            email: this.email,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(UserProfile_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(UserProfile_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            name: raw[rawColumnName('name')],
            email: raw[rawColumnName('email')],
        });
    }
};
UserProfile.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'email',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], UserProfile.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], UserProfile.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], UserProfile.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'name', length: 255 }),
    __metadata("design:type", String)
], UserProfile.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'email', length: 255, nullable: true }),
    __metadata("design:type", Object)
], UserProfile.prototype, "email", void 0);
UserProfile = UserProfile_1 = __decorate([
    typeorm_1.Entity('user_profiles')
], UserProfile);
exports.default = UserProfile;
