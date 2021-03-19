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
var Cafe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CafeState = void 0;
const typeorm_1 = require("typeorm");
const place_1 = __importDefault(require("./place"));
const cafeStatistic_1 = __importDefault(require("./cafeStatistic"));
const cafeImage_1 = __importDefault(require("./cafeImage"));
const cafeImageCount_1 = __importDefault(require("./cafeImageCount"));
var CafeState;
(function (CafeState) {
    CafeState[CafeState["active"] = 0] = "active";
    CafeState[CafeState["hidden"] = 1] = "hidden";
    CafeState[CafeState["deleted"] = 2] = "deleted";
})(CafeState = exports.CafeState || (exports.CafeState = {}));
let Cafe = Cafe_1 = class Cafe {
    get metadataObject() {
        return this.metadata ? JSON.parse(this.metadata) : null;
    }
    set metadataObject(obj) {
        this.metadata = JSON.stringify(obj);
    }
    get stateString() {
        return CafeState[this.state];
    }
    isDeleted() {
        return this.state === CafeState.deleted;
    }
    toJsonObject(options) {
        var _a, _b, _c, _d;
        if (this.isDeleted()) {
            return {
                id: this.id,
            };
        }
        const imageCount = ((_a = options === null || options === void 0 ? void 0 : options.showHiddenImages) !== null && _a !== void 0 ? _a : false)
            ? this.imageCount.total
            : this.imageCount.active;
        const imageList = (_c = (_b = this.images) === null || _b === void 0 ? void 0 : _b.map((image) => image.toJsonObject())) === null || _c === void 0 ? void 0 : _c.map((imageObject, index) => {
            /* correct the image indices */
            return Object.assign(Object.assign({}, imageObject), { index });
        });
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            name: this.name,
            place: (_d = this.place) === null || _d === void 0 ? void 0 : _d.toJsonObject(),
            metadata: this.metadataObject,
            state: this.stateString,
            image: this.imageCount && {
                count: imageCount,
                list: imageList,
            },
            views: this.statistic && {
                daily: this.statistic.dailyViews,
                weekly: this.statistic.weeklyViews,
                monthly: this.statistic.monthlyViews,
                total: this.statistic.totalViews,
            },
            numLikes: this.statistic.numLikes,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(Cafe_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(Cafe_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            name: raw[rawColumnName('name')],
            fkPlaceId: raw[rawColumnName('fk_place_id')],
            metadata: raw[rawColumnName('metadata')],
            state: raw[rawColumnName('state')],
        });
    }
};
Cafe.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'name',
    'fkPlaceId',
    'metadata',
    'state',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], Cafe.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Cafe.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Cafe.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'name', length: 255 }),
    __metadata("design:type", String)
], Cafe.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_place_id' }),
    __metadata("design:type", String)
], Cafe.prototype, "fkPlaceId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => place_1.default),
    typeorm_1.JoinColumn({ name: 'fk_place_id' }),
    __metadata("design:type", place_1.default)
], Cafe.prototype, "place", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'metadata', length: 4000, nullable: true }),
    __metadata("design:type", Object)
], Cafe.prototype, "metadata", void 0);
__decorate([
    typeorm_1.Column({ type: 'int2', name: 'state' }),
    __metadata("design:type", Number)
], Cafe.prototype, "state", void 0);
__decorate([
    typeorm_1.OneToOne(() => cafeStatistic_1.default, (statistic) => statistic.cafe),
    __metadata("design:type", cafeStatistic_1.default)
], Cafe.prototype, "statistic", void 0);
__decorate([
    typeorm_1.OneToOne(() => cafeImageCount_1.default, (imageCount) => imageCount.cafe),
    __metadata("design:type", cafeImageCount_1.default)
], Cafe.prototype, "imageCount", void 0);
__decorate([
    typeorm_1.OneToMany(() => cafeImage_1.default, (image) => image.cafe),
    __metadata("design:type", Array)
], Cafe.prototype, "images", void 0);
Cafe = Cafe_1 = __decorate([
    typeorm_1.Entity('cafes')
], Cafe);
exports.default = Cafe;
