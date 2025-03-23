import {
    Command,
    EventParams,
    Handler,
  } from '@discord-nestjs/core';
  import { ChatInputCommandInteraction, ClientEvents } from 'discord.js';
  import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { NobodyamCommandService } from '../services/domain/nobodyam-command/nobodyam-command.service';

@Command({
  name: 'ninguemsou',
  description: 'Descubra quantos memes ainda não sairam no /eusou',
})
@Injectable()
export class NobodyAmCommand {
    constructor(
        private readonly nobodyamCommandService: NobodyamCommandService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext(NobodyAmCommand.name)
    }

    @Handler()
    async onNobodyAmCommand(
        @EventParams() args: ClientEvents['interactionCreate'],
    ) {
        const chatInputInteraction: ChatInputCommandInteraction = args[0] as ChatInputCommandInteraction;
        const message = await this.nobodyamCommandService.execute()
        await chatInputInteraction.channel.send(message);
    } catch (e) {
        this.logger.error(e, e?.stack)
    }
}