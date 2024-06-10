import { Module } from '@nestjs/common';
import { IamTelegramService } from './services/domain/iam-telegram/iam-telegram.service';
import { MemeModule } from '../meme/meme.module';
import { TelegramMiddlewareServer } from './middlewares/telegram-bot.middleware';
import { IamController } from './controllers/iam/iam.controller';
import { TelegramBotProvider } from './providers/telegram-bot.provider';

@Module({
  imports: [
    MemeModule,
  ],
  providers: [
    IamTelegramService,
    TelegramMiddlewareServer,
    TelegramBotProvider
  ],
  controllers: [IamController],
})
export class TelegramModule {}
