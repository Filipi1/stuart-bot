import { Module } from '@nestjs/common';
import { BotModule } from './modules/bot/bot.module';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { MemeModule } from './modules/meme/meme.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotModule, 
    SharedModule, 
    MemeModule, 
    TelegramModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
