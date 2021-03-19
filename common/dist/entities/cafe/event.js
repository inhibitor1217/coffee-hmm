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
var Event_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventName = exports.EventCategory = void 0;
const typeorm_1 = require("typeorm");
var EventCategory;
(function (EventCategory) {
    EventCategory["CAFE"] = "CAFE";
})(EventCategory = exports.EventCategory || (exports.EventCategory = {}));
var EventName;
(function (EventName) {
    EventName["VIEW"] = "VIEW";
})(EventName = exports.EventName || (exports.EventName = {}));
let Event = Event_1 = class Event {
    toJsonObject() {
        return {
            id: this.id,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            userId: this.userId,
            category: this.category,
            name: this.name,
            label: this.label,
            value: this.value,
        };
    }
    static fromRawColumns(raw, options) {
        var _a, _b;
        const rawColumnName = (column) => [options === null || options === void 0 ? void 0 : options.alias, column].filter((e) => !!e).join('_');
        const repo = (_b = (_a = options === null || options === void 0 ? void 0 : options.connection) === null || _a === void 0 ? void 0 : _a.getRepository(Event_1)) !== null && _b !== void 0 ? _b : typeorm_1.getRepository(Event_1);
        return repo.create({
            id: raw[rawColumnName('id')],
            createdAt: raw[rawColumnName('created_at')],
            updatedAt: raw[rawColumnName('updated_at')],
            userId: raw[rawColumnName('uid')],
            category: raw[rawColumnName('category')],
            name: raw[rawColumnName('name')],
            label: raw[rawColumnName('label')],
            value: raw[rawColumnName('value')],
        });
    }
};
Event.columns = [
    'id',
    'createdAt',
    'updatedAt',
    'userId',
    'category',
    'name',
    'label',
    'value',
];
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid', { name: 'id' }),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ type: 'uuid', name: 'uid', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'category', length: 255 }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'name', length: 255 }),
    __metadata("design:type", String)
], Event.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'label', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "label", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', name: 'value', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "value", void 0);
Event = Event_1 = __decorate([
    typeorm_1.Entity('events')
], Event);
exports.default = Event;
