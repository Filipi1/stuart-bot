import {
    Command,
    EventParams,
    Handler,
    InteractionEvent,
  } from '@discord-nestjs/core';
  import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ClientEvents, MessageComponentInteraction } from 'discord.js';
  import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { NewMemeCommandInputDTO } from '../dtos/new-meme-command.dto';
import { Injectable } from '@nestjs/common';
import { SupportedImageFormats } from 'src/modules/shared/services/dropbox/enums/image_format.enum';
import { MemeEmbedGetterService } from 'src/modules/meme/services/domain/meme-embed-getter/meme-embed-getter.service';
import { MemeCreatorService } from 'src/modules/meme/services/domain/meme-creator/meme-creator.service';
import { DeniedMessages } from '../utils/denied-messages.utils';


@Command({
    name: 'novomeme',
    description: 'Cria um novo meme que terá uma chance de ser sorteado pelo comando /eusou',
})
@Injectable()
export class NewMemeCommand  {
    constructor(
        private readonly logger: LoggerService,
        private readonly memeCreatorService: MemeCreatorService,
        private readonly memeEmbedGetter: MemeEmbedGetterService,
    ) {
        this.logger.setContext(NewMemeCommand.name)
    }

    @Handler()
    async onNewMemeCommand(
        @InteractionEvent(SlashCommandPipe) payload: NewMemeCommandInputDTO, 
        @EventParams() args: ClientEvents['interactionCreate'],
    ) {
        const chatInputInteraction: ChatInputCommandInteraction = args[0] as ChatInputCommandInteraction
        if (!chatInputInteraction.isCommand()) return;
        try {
            const authorName = chatInputInteraction.member["nickname"] ?? chatInputInteraction.user.username;

            await chatInputInteraction.channel.send(`Parece que o meme se chamará **||${payload.title}||**, intrigante... Agora **${authorName}** deve enviar uma imagem para esse meme, vamos aguardar...`);
            await chatInputInteraction.channel.send(`Ah, **${authorName}**, lembre-se que você pode enviar uma imagem em modo **Spoiler** caso queira um ⛈️⛈️suspeeeense⛈️⛈️.`);
            await chatInputInteraction.channel.send(`Para isso, basta arrastar sua imagem para o chat e antes de enviar, clique no simbolo do olhinho 👁️.`);

            const filter = (response) => response.author.id === chatInputInteraction.user.id;
            const collector = chatInputInteraction.channel.createMessageCollector({ filter, time: 60000 });

            collector.on('collect', async (responseMessage) => {
                if (responseMessage.attachments.size <= 0) {
                    await chatInputInteraction.channel.send(`Desculpe, não há imagens na mensagem enviada. Envie uma imagem válida antes que o tempo expire.`);
                    return;
                }

                const image = responseMessage.attachments.first()
                if (!SupportedImageFormats.includes(image.contentType)) {
                    await chatInputInteraction.channel.send(`Desculpe, o formato de imagem não é permitido. Permitidos: .jpg, .jpeg, .png`);
                    return;
                }

                const memeEmbedGetterResponse = this.memeEmbedGetter.execute({ 
                    title: payload.title, 
                    description: payload.description,
                    drawnTimes: 0,
                    image: image,
                    isSpoiler: true
                })

                const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Ok, salvar!')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('deny')
                        .setLabel('Não, desfazer.')
                        .setStyle(ButtonStyle.Danger)
                    );

                await chatInputInteraction.channel.send(`**${authorName}**, seu novo meme ficará assim:`)
                await chatInputInteraction.channel.send({ embeds: [memeEmbedGetterResponse.embed], files: memeEmbedGetterResponse.attachment ? [memeEmbedGetterResponse.attachment] : null, components: [buttons] })
                
                const buttonFilter = (i) => i.user.id === chatInputInteraction.user.id;
                const buttonCollector = chatInputInteraction.channel.createMessageComponentCollector({ filter: buttonFilter, max: 1, time: 30000 });

                buttonCollector.on('collect', async (iMessage: MessageComponentInteraction) => {
                    if (iMessage.customId === 'confirm') {
                        buttonCollector.stop()
                        await responseMessage.delete()
                        await iMessage.update({ content: `**${authorName}**, tudo certo, estou criando seu meme...`, components: [], embeds: [] });
                        await this.memeCreatorService.execute({ title: payload.title, description: payload.description, image: image })
                        await chatInputInteraction.channel.send({ content: `✅ **${authorName}**, seu meme foi criado!`, components: [], embeds: [] });
                    } else {
                        await responseMessage.delete()
                        await iMessage.update({ content: '🗑️ Ok, não criarei esse meme.', components: [], embeds: [] });
                        buttonCollector.stop()
                    }
                });

                collector.stop("Manually Stopped");
            });
        
            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    await chatInputInteraction.channel.send(`⏲️ Tempo limite para enviar a imagem excedido, prepara o meme e digite /novomeme para iniciar novamente.`);
                    return;
                }
                this.logger.log(`Fineshed to collect messages, reason: ${reason}`)
            });

            return `Silêncio! O **${authorName}** está fazendo um novo meme, vamos conferir:`
        } catch (e) {
            this.logger.error(e, e?.stack)
            await chatInputInteraction.channel.send(DeniedMessages.getRandomMessage());
        }
    }
}