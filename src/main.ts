import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './modules/shared/services/logger/logger.service';
import { TelegramMiddlewareServer } from './modules/telegram/middlewares/telegram-bot.middleware';
import { TelegramProviders } from './modules/telegram/enums/telegram-providers.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerService = await app.resolve(LoggerService);
  app.connectMicroservice({
    strategy: new TelegramMiddlewareServer(
      await app.resolve(TelegramProviders.bot),
      loggerService,
    ),
  });
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
