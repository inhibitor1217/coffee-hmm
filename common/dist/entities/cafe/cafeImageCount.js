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
var CafeImageCount_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cafe_1 = __importDefault(require("./cafe"));
let CafeImageCount = CafeImageCount_1 = class CafeImageCount {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            cafeId: this.fkCafeId,
            total: this.total,
            active: this.active,
            hidden: this.total - this.active,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(CafeImageCount_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(CafeImageCount_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            fkCafeId: raw[rawColumnName('fk_cafe_id')],
            total: raw[rawColumnName('total')],
            active: raw[rawColumnName('active')],
        });
    }
};
CafeImageCount.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'total',
    'active',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], CafeImageCount.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CafeImageCount.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], CafeImageCount.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_cafe_id' }),
    __metadata("design:type", String)
], CafeImageCount.prototype, "fkCafeId", void 0);
__decorate([
    typeorm_1.OneToOne(() => cafe_1.default),
    typeorm_1.JoinColumn({ name: 'fk_cafe_id' }),
    __metadata("design:type", cafe_1.default)
], CafeImageCount.prototype, "cafe", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'total' }),
    __metadata("design:type", Number)
], CafeImageCount.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'active' }),
    __metadata("design:type", Number)
], CafeImageCount.prototype, "active", void 0);
CafeImageCount = CafeImageCount_1 = __decorate([
    typeorm_1.Entity('cafe_image_counts')
], CafeImageCount);
exports.default = CafeImageCount;
