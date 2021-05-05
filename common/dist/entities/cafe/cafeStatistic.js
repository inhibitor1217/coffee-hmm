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
var CafeStatistic_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cafe_1 = __importDefault(require("./cafe"));
let CafeStatistic = CafeStatistic_1 = class CafeStatistic {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            cafeId: this.fkCafeId,
            views: {
                daily: this.dailyViews,
                weekly: this.weeklyViews,
                monthly: this.monthlyViews,
                total: this.totalViews,
            },
            numLikes: this.numLikes,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(CafeStatistic_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(CafeStatistic_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            fkCafeId: raw[rawColumnName('fk_cafe_id')],
            dailyViews: raw[rawColumnName('daily_views')],
            weeklyViews: raw[rawColumnName('weekly_views')],
            monthlyViews: raw[rawColumnName('monthly_views')],
            totalViews: raw[rawColumnName('total_views')],
            numReviews: raw[rawColumnName('num_reviews')],
            sumRatings: raw[rawColumnName('sum_ratings')],
            numLikes: raw[rawColumnName('num_likes')],
        });
    }
};
CafeStatistic.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'fkCafeId',
    'dailyViews',
    'weeklyViews',
    'monthlyViews',
    'totalViews',
    'numReviews',
    'sumRatings',
    'numLikes',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], CafeStatistic.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], CafeStatistic.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], CafeStatistic.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'fk_cafe_id' }),
    __metadata("design:type", String)
], CafeStatistic.prototype, "fkCafeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => cafe_1.default),
    typeorm_1.JoinColumn({ name: 'fk_cafe_id' }),
    __metadata("design:type", cafe_1.default)
], CafeStatistic.prototype, "cafe", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'daily_views' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "dailyViews", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'weekly_views' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "weeklyViews", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'monthly_views' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "monthlyViews", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'total_views' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "totalViews", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'num_reviews' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "numReviews", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'sum_ratings' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "sumRatings", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'num_likes' }),
    __metadata("design:type", Number)
], CafeStatistic.prototype, "numLikes", void 0);
CafeStatistic = CafeStatistic_1 = __decorate([
    typeorm_1.Entity('cafe_statistics')
], CafeStatistic);
exports.default = CafeStatistic;
