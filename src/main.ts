import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Rest-API Forex-Trading-System')
    .setDescription('Can get the exchange rate, top-up account, get balance, and convert currency.')
    .setVersion('1.0')
    .addTag('forex-trading-system')
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Mount Swagger UI
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(3000);
}
bootstrap();
