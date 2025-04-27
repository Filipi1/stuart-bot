import {
    Command,
    EventParams,
    Handler,
} from '@discord-nestjs/core';
import { ClientEvents, GuildMember } from 'discord.js';
import { ListAudiosService } from '../services/domain/list-audios/list-audios.service';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { DeniedMessages } from '../utils/denied-messages.utils';

@Command({ name: 'audios', description: 'Lista todos os áudios disponíveis' })
@Injectable()
export class ListAudiosCommand {
    constructor(
        private readonly listAudiosService: ListAudiosService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext(ListAudiosCommand.name);
    }

    @Handler()
    async onCommand(
        @EventParams() [interaction]: ClientEvents['interactionCreate'],
    ): Promise<void> {
        if (!interaction.isCommand()) return;

        try {
            await interaction.reply({ content: 'Buscando lista de áudios...', ephemeral: true });
            const audioList = await this.listAudiosService.getAudioList();
            const message = `Aqui estão os áudios do bar do stuart:\n\n${audioList.join('\n')}`;
            const member = interaction.member as GuildMember;
            await member.send(message);
            await interaction.editReply({ content: 'Lista de áudios enviada no seu privado! 📩' });
        } catch (error) {
            this.logger.error(`Erro ao listar áudios: ${error.message}`);
            await interaction.editReply({ content: DeniedMessages.getRandomMessage() });
        }
    }
} 