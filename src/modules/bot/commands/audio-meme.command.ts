import {
    Command,
    EventParams,
    Handler,
    InteractionEvent
} from '@discord-nestjs/core';
import { ClientEvents, GuildMember, VoiceChannel } from 'discord.js';
import { AudioMemeCommandService } from '../services/domain/audio-meme-command/audio-meme-command.service';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { AudioMemeCommandInputDTO } from '../dtos/audio-meme-command.dto';
import * as path from 'path';
import { existsSync } from 'fs';

@Command({ name: 'toca', description: 'Quando estiver em um canal de voz, você pode tocar um meme de áudio' })
@Injectable()
export class AudioMemeCommand {
    private readonly audioPath = path.join(process.cwd(), 'audios');

    constructor(
        private readonly audioMemeService: AudioMemeCommandService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext(AudioMemeCommand.name);
    }

    @Handler()
    async onCommand(
        @EventParams() [interaction]: ClientEvents['interactionCreate'],
        @InteractionEvent(SlashCommandPipe) dto: AudioMemeCommandInputDTO
    ): Promise<void> {
        if (!interaction.isCommand()) return;

        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('Você precisa estar em um canal de voz para usar este comando!');
            return;
        }

        if (!(voiceChannel instanceof VoiceChannel)) {
            await interaction.reply('O canal precisa ser um canal de voz válido!');
            return;
        }

        if (!dto.nome) {
            await interaction.reply('Por favor, especifique o nome do áudio!');
            return;
        }

        const audioFile = path.join(this.audioPath, `${dto.nome}.ogg`);
        if (!existsSync(audioFile)) {
            await interaction.reply(`Desculpe, o áudio "${dto.nome}" não foi encontrado! 😢`);
            return;
        }

        try {
            await interaction.reply('Tocando o meme...');
            await this.audioMemeService.playAudio(voiceChannel, dto.nome);
        } catch (error) {
            this.logger.error(`Erro ao tocar áudio: ${error.message}`);
            await interaction.editReply('Ocorreu um erro ao tentar tocar o áudio. Por favor, tente novamente.');
        }
    }
} 