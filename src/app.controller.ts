import { Controller, Get,Post,Body, Param } from '@nestjs/common';
import { AppService, AccountService,FxConversionService } from './app.service';
import { AccountDtO } from './dto/Account.dto';
import { FxConversionDto } from './dto/FxConversion.dto';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  getHello(): string {
    return "Hello World";
  }
  @Get('/fx-rates')
  getExchangeRate() {
    return this.appService.getExchangeRates();
  }
}
@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/top-up/:id')
  async topUpAccount(@Body() accountDtO: AccountDtO, @Param('id') id): Promise<void> {
    await this.accountService.topUp(accountDtO, id);
  }

  @Get('/balance/:id')
  async getBalance(@Param('id') id) {
    return this.accountService.getBalance(id);
  }
}


@Controller('fx-conversion')
export class FxConversionController {
  constructor(private readonly fxConversionService: FxConversionService) {}

  @Post()
  async convert(@Body() conversionDto: FxConversionDto): Promise<{ convertedAmount: number, currency: string }> {
    return this.fxConversionService.performConversion(conversionDto);
  }
}


