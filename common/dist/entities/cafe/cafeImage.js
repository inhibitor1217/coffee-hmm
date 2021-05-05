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
var CafeImage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CafeImageState = void 0;
const typeorm_1 = require("typeorm");
const cafe_1 = __importDefault(require("./cafe"));
var CafeImageState;
(function (CafeImageState) {
    CafeImageState[CafeImageState["active"] = 0] = "active";
    CafeImageState[CafeImageState["hidden"] = 1] = "hidden";
    CafeImageState[CafeImageState["deleted"] = 2] = "deleted";
})(CafeImageState = exports.CafeImageState || (exports.CafeImageState = {}));
let CafeImage = CafeImage_1 = class CafeImage {
    get metadataObject() {
        return this.metadata ? JSON.parse(this.metadata) : null;
    }
    set metadataObject(obj) {
        this.metadata = JSON.stringify(obj);
    }
    get stateString() {
        return CafeImageState[this.state];
    }
    isDeleted() {
        return this.state === CafeImageState.deleted;
    }
    toJsonObject() {
        if (this.isDeleted()) {
            return {
                id: this.id,
            };
        }
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            cafeId: this.fkCafeId,
            index: this.index,
            isMain: this.isMain,
            metadata: this.metadataObject,
            relativeUri: this.relativeUri,
            state: this.stateString,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(CafeImage_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(CafeImage_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            fkCafeId: raw[rawColumnName('fk_cafe_id')],
            index: raw[rawColumnName('index')],
            isMain: raw[rawColumnName('is_main')],
            metadata: raw[rawColumnName('metadata')],
            relativeUri: raw[rawColumnName('relative_uri')],
            state: raw[rawColumnName('state')],
        });
    }
};
CafeImage.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'index',
    'isMain',
    'metadata',
    'relativeUri',
    'state',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], CafeImage.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CafeImage.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], CafeImage.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_cafe_id' }),
    __metadata("design:type", String)
], CafeImage.prototype, "fkCafeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cafe_1.default),
    typeorm_1.JoinColumn({ name: 'fk_cafe_id' }),
    __metadata("design:type", cafe_1.default)
], CafeImage.prototype, "cafe", void 0);
__decorate([
    typeorm_1.Column({ type: 'int2', name: 'index' }),
    __metadata("design:type", Number)
], CafeImage.prototype, "index", void 0);
__decorate([
    typeorm_1.Column({ type: 'boolean', name: 'is_main' }),
    __metadata("design:type", Boolean)
], CafeImage.prototype, "isMain", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'metadata', length: 4000, nullable: true }),
    __metadata("design:type", Object)
], CafeImage.prototype, "metadata", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'relative_uri' }),
    __metadata("design:type", String)
], CafeImage.prototype, "relativeUri", void 0);
__decorate([
    typeorm_1.Column({ type: 'int2', name: 'state' }),
    __metadata("design:type", Number)
], CafeImage.prototype, "state", void 0);
CafeImage = CafeImage_1 = __decorate([
    typeorm_1.Entity('cafe_images')
], CafeImage);
exports.default = CafeImage;
