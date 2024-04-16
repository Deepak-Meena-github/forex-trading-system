import { AppService, AccountService, FxConversionService } from './app.service';
import { AccountDtO } from './dto/Account.dto';
import { FxConversionDto } from './dto/FxConversion.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getExchangeRate(): Promise<{
        [key: string]: {
            rate: number;
            expiryAt: string;
        };
    }>;
}
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    topUpAccount(accountDtO: AccountDtO, id: any): Promise<void>;
    getBalance(id: any): Promise<{
        balances: {
            [key: string]: number;
        };
    }>;
}
export declare class FxConversionController {
    private readonly fxConversionService;
    constructor(fxConversionService: FxConversionService);
    convert(conversionDto: FxConversionDto): Promise<{
        convertedAmount: number;
        currency: string;
    }>;
}
