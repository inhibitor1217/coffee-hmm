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
var Place_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let Place = Place_1 = class Place {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            name: this.name,
            pinned: this.pinned,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(Place_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(Place_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            name: raw[rawColumnName('name')],
            pinned: raw[rawColumnName('pinned')],
        });
    }
};
Place.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'pinned',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], Place.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Place.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Place.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'name', length: 255 }),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'pinned' }),
    __metadata("design:type", Boolean)
], Place.prototype, "pinned", void 0);
Place = Place_1 = __decorate([
    typeorm_1.Entity('places'),
    typeorm_1.Unique('idx_name', ['name'])
], Place);
exports.default = Place;
