import {
    Command,
    EventParams,
    Handler,
    InteractionEvent,
} from '@discord-nestjs/core';
import { ChatInputCommandInteraction, ClientEvents, GuildMember } from 'discord.js';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ChatCommandService } from '../services/domain/chat-command/chat-command.service';
import { DeniedMessages } from '../utils/denied-messages.utils';
import { ChatCommandInputDTO } from '../dtos/chat-command.dto';
import { SlashCommandPipe } from '@discord-nestjs/common';

@Command({
    name: 'chat',
    description: 'Pergunte algo ao stuart!',
    descriptionLocalizations: {
        "pt-BR": "Pergunte algo ao stuart!"
    }
})
@Injectable()
export class ChatCommand {
    constructor(
        private readonly chatCommandService: ChatCommandService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext(ChatCommand.name);
    }

    @Handler()
    async onChatCommand(
        @EventParams() args: ClientEvents['interactionCreate'],
        @InteractionEvent(SlashCommandPipe) dto: ChatCommandInputDTO
    ) {
        const interaction = args[0] as ChatInputCommandInteraction;
        if (!interaction.isCommand()) return;

        try {
            console.time("Discord Chat Command Duration");
            this.logger.warn(`Requested in Server: ${args[0]?.guild ?? "Private"}`);
            this.logger.log(`${args[0].user.id} - ${args[0].user.displayName} requested 'chat' command`);

            await interaction.deferReply();

            let username = interaction.user.username;
            if (interaction.member instanceof GuildMember) {
                username = interaction.member.nickname ?? username;
            }

            const chatResponse = await this.chatCommandService.execute({
                prompt: dto.mensagem,
                username: username
            });

            await interaction.followUp({
                content: chatResponse.response
            });

            console.timeEnd("Discord Chat Command Duration");
        } catch (e) {
            this.logger.error(e, e?.stack);
            await interaction.editReply(DeniedMessages.getRandomMessage());
        }
    }
} 