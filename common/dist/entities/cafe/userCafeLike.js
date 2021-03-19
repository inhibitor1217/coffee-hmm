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
var UserCafeLike_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cafe_1 = __importDefault(require("./cafe"));
let UserCafeLike = UserCafeLike_1 = class UserCafeLike {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            cafeId: this.fkCafeId,
            userId: this.userId,
            like: this.like,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(UserCafeLike_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(UserCafeLike_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            fkCafeId: raw[rawColumnName('fk_cafe_id')],
            userId: raw[rawColumnName('uid')],
            like: raw[rawColumnName('like')],
        });
    }
};
UserCafeLike.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'userId',
    'like',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], UserCafeLike.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], UserCafeLike.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], UserCafeLike.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_cafe_id' }),
    __metadata("design:type", String)
], UserCafeLike.prototype, "fkCafeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cafe_1.default),
    typeorm_1.JoinColumn({ name: 'fk_cafe_id' }),
    __metadata("design:type", cafe_1.default)
], UserCafeLike.prototype, "cafe", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'uid' }),
    __metadata("design:type", String)
], UserCafeLike.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'like' }),
    __metadata("design:type", Boolean)
], UserCafeLike.prototype, "like", void 0);
UserCafeLike = UserCafeLike_1 = __decorate([
    typeorm_1.Entity('user_cafe_likes')
], UserCafeLike);
exports.default = UserCafeLike;
