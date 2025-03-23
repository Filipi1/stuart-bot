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

@Module({
  imports: [
    DiscordModule.forFeature(),
    MemeModule
  ],
  providers: [
    IamCommandService,
    IAMCommand,
    NewMemeCommandService,
    NewMemeCommand,
    NobodyAmCommand,
    NobodyamCommandService,
    BotGateway,
  ],
  controllers: []
})
export class BotModule {}
