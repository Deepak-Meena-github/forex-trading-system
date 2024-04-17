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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxConversionService = exports.AccountService = exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const exchangeRatesMap = new Map();
setTimeout(() => {
    Array.from(exchangeRatesMap.keys()).forEach(currencyPair => {
        axios_1.default.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`)
            .then(response => { exchangeRatesMap[currencyPair] = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']; });
    });
}, 30 * 60 * 1000);
let AppService = class AppService {
    constructor() {
        this.supportedPairs = new Set(['USD-EUR', 'USD-GBP', 'EUR-USD', 'EUR-GBP', 'GBP-USD', 'GBP-EUR']);
    }
    async getExchangeRates() {
        const currentTime = Math.floor(Date.now() / 1000);
        const exchangeRates = {};
        for (const currencyPair of this.supportedPairs) {
            try {
                if (exchangeRatesMap.has(currencyPair)) {
                    const { rate, expiryAt } = exchangeRatesMap.get(currencyPair);
                    if (expiryAt > currentTime) {
                        const formattedExpiryAt = new Date(expiryAt * 1000).toLocaleString();
                        exchangeRates[currencyPair] = { rate, expiryAt: formattedExpiryAt };
                        continue;
                    }
                }
                const response = await axios_1.default.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`);
                console.log(response.data, "Deepak");
                const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
                const expiryAt = currentTime + 30 * 60 * 1000;
                exchangeRatesMap.set(currencyPair, { rate: parseFloat(exchangeRate), expiryAt });
                const formattedExpiryAt = new Date(expiryAt * 1000).toLocaleString();
                exchangeRates[currencyPair] = { rate: parseFloat(exchangeRate), expiryAt: formattedExpiryAt };
            }
            catch (error) {
                console.error(`Error fetching exchange rate for ${currencyPair}:`, error.message);
            }
        }
        return exchangeRates;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
let AccountService = class AccountService {
    constructor() {
        this.balances = {};
    }
    topUp(topUpDto, id) {
        const { currency, amount } = topUpDto;
        if (amount <= 0) {
            throw new Error('Invalid amount: Amount must be greater than zero');
        }
        if (!this.balances[id])
            this.balances[id] = {};
        if (!this.balances[id][currency])
            this.balances[id][currency] = 0;
        this.balances[id][currency] += amount;
    }
    getBalance(id) {
        console.log(this.balances[id], "Deepak");
        return { balances: this.balances[id] };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)()
], AccountService);
let FxConversionService = class FxConversionService {
    constructor(appService) {
        this.appService = appService;
    }
    async performConversion(conversionDto) {
        const { fromCurrency, toCurrency, amount } = conversionDto;
        const currencyPair = `${fromCurrency}-${toCurrency}`;
        const currencyPairExists = exchangeRatesMap.has(currencyPair);
        let exchangeRated;
        if (currencyPairExists) {
            const { rate, expiryAt } = exchangeRatesMap.get(currencyPair);
            exchangeRated = amount * rate;
            console.log(`${currencyPair} exists in the exchange rates map.`);
        }
        else {
            const response = await axios_1.default.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyPair.split('-')[0]}&to_currency=${currencyPair.split('-')[1]}&apikey=MVMTWELWDVXO1DXO`);
            const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
            const currentTime = Math.floor(Date.now() / 1000);
            const expiryAt = currentTime + 30 * 60 * 1000;
            exchangeRatesMap.set(currencyPair, { rate: parseFloat(exchangeRate), expiryAt });
            exchangeRated = amount * parseFloat(exchangeRate);
        }
        const convertedAmount = exchangeRated * amount;
        console.log(convertedAmount, "Deepak", exchangeRated, amount);
        return { convertedAmount, currency: toCurrency };
    }
};
exports.FxConversionService = FxConversionService;
exports.FxConversionService = FxConversionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [AppService])
], FxConversionService);
//# sourceMappingURL=app.service.js.map