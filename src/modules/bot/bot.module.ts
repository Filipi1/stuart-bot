import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from './gateways/bot.gateway';
import { IAMCommand } from './commands/iam.command';
import { IamCommandService } from './services/domain/iam-command/iam-command.service';
import { MemeModule } from '../meme/meme.module';
import { NewMemeCommandService } from './services/domain/new-meme-command/new-meme-command.service';
import { NewMemeCommand } from './commands/new-meme.command';
import { NobodyamCommandService } from './services/domain/nobodyam-command/nobodyam-command.service';
import { NobodyAmCommand } from './commands/nobodyam.command';
import { UserModule } from '../user/user.module';
import { ChatCommand } from './commands/chat.command';
import { ChatCommandService } from './services/domain/chat-command/chat-command.service';

@Module({
  imports: [
    DiscordModule.forFeature(),
    MemeModule,
    UserModule
  ],
  providers: [
    IamCommandService,
    IAMCommand,
    NewMemeCommandService,
    NewMemeCommand,
    NobodyAmCommand,
    NobodyamCommandService,
    ChatCommand,
    ChatCommandService,
    BotGateway,
  ],
  controllers: []
})
export class BotModule {}
