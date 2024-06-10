import { Module } from '@nestjs/common';
import { BotModule } from './modules/bot/bot.module';
import { SharedModule } from './modules/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './modules/discord/discord.module';
import { MemeModule } from './modules/meme/meme.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BotModule, 
    SharedModule, 
    DiscordModule, 
    MemeModule, 
    TelegramModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
