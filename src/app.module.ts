import { Module } from '@nestjs/common';
import { AccountController, AppController, FxConversionController } from './app.controller';
import { AccountService, AppService, FxConversionService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [],
  controllers: [AppController, AccountController, FxConversionController],
  providers: [AppService, AccountService, FxConversionService], // Include FxConversionService here
})
export class AppModule {}
