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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxConversionController = exports.AccountController = exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const Account_dto_1 = require("./dto/Account.dto");
const FxConversion_dto_1 = require("./dto/FxConversion.dto");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return "Hello World";
    }
    getExchangeRate() {
        return this.appService.getExchangeRates();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/fx-rates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getExchangeRate", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async topUpAccount(accountDtO, id) {
        await this.accountService.topUp(accountDtO, id);
    }
    async getBalance(id) {
        return this.accountService.getBalance(id);
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, common_1.Post)('/top-up/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Account_dto_1.AccountDtO, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "topUpAccount", null);
__decorate([
    (0, common_1.Get)('/balance/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getBalance", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('/account'),
    __metadata("design:paramtypes", [app_service_1.AccountService])
], AccountController);
let FxConversionController = class FxConversionController {
    constructor(fxConversionService) {
        this.fxConversionService = fxConversionService;
    }
    async convert(conversionDto) {
        return this.fxConversionService.performConversion(conversionDto);
    }
};
exports.FxConversionController = FxConversionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FxConversion_dto_1.FxConversionDto]),
    __metadata("design:returntype", Promise)
], FxConversionController.prototype, "convert", null);
exports.FxConversionController = FxConversionController = __decorate([
    (0, common_1.Controller)('fx-conversion'),
    __metadata("design:paramtypes", [app_service_1.FxConversionService])
], FxConversionController);
//# sourceMappingURL=app.controller.js.map