import { Module } from '@nestjs/common';
import { IamTelegramService } from './services/domain/iam-telegram/iam-telegram.service';
import { MemeModule } from '../meme/meme.module';
import { TelegramMiddlewareServer } from './middlewares/telegram-bot.middleware';
import { IamController } from './controllers/iam/iam.controller';
import { TelegramBotProvider } from './providers/telegram-bot.provider';
import { CoachController } from './controllers/coach/coach.controller';
import { CoachTelegramService } from './services/domain/coach-telegram/coach-telegram.service';
import { CoachModule } from '../coach/coach.module';
import { NewCoachController } from './controllers/new-coach/new-coach.controller';
import { NewCoachTelegramService } from './services/domain/new-coach-telegram/new-coach-telegram.service';

@Module({
  imports: [
    MemeModule,
    CoachModule
  ],
  providers: [
    IamTelegramService,
    TelegramMiddlewareServer,
    TelegramBotProvider,
    CoachTelegramService,
    NewCoachTelegramService
  ],
  controllers: [IamController, CoachController, NewCoachController],
})
export class TelegramModule {}
