import { AccountDtO } from './dto/Account.dto';
import { FxConversionDto } from './dto/FxConversion.dto';
export declare class AppService {
    private supportedPairs;
    getExchangeRates(): Promise<{
        [key: string]: {
            rate: number;
            expiryAt: string;
        };
    }>;
}
export declare class AccountService {
    private balances;
    topUp(topUpDto: AccountDtO, id: string): void;
    getBalance(id: string): {
        balances: {
            [key: string]: number;
        };
    };
}
export declare class FxConversionService {
    private readonly appService;
    constructor(appService: AppService);
    performConversion(conversionDto: FxConversionDto): Promise<{
        convertedAmount: number;
        currency: string;
    }>;
}
