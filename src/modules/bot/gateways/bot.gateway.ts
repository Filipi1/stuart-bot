import {
  InjectDiscordClient,
  On,
  Once,
} from '@discord-nestjs/core';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { ActivityType, Client, Message} from 'discord.js';
import { MessageFromUserGuard } from '../guards/message-from-user.guard';
import { PrefixGuard } from '../guards/prefix.guard';
import { MemeRepository } from 'src/modules/meme/repositories/meme.repository';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly memeRepository: MemeRepository
  ) {}

  @Once('ready')
  async onReady() {
    this.logger.warn(`Discord Bot - ${this.client.user.tag} was started!`);
    const memes = await this.memeRepository.getAllMemes()
    this.client.user.setActivity(`${memes.length} memes.`, { type: ActivityType.Playing })
  }

  @On('messageCreate')
  @UseGuards(MessageFromUserGuard, PrefixGuard)
  async onMessage(message: Message): Promise<string> {
    this.logger.log(`Recevie ${this.client.user.tag} message: ${message}`);
    return 'Não uso mais comandos com **#**, experimente usar um comando com **/** no lugar de #';
  }
}