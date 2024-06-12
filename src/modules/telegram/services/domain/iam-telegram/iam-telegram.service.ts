import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { MemeEntity } from 'src/modules/meme/entities/meme.entity';
import { DropboxService } from 'src/modules/shared/services/dropbox/dropbox.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';
import { TelegramCommand } from 'src/modules/telegram/interfaces/telegram-command.interface';
import { RandomMemeGetterService } from 'src/modules/meme/services/domain/random-meme-getter/random-meme-getter.service';
import { DeniedMessages } from 'src/modules/bot/utils/denied-messages.utils';

export interface IamTelegramResponse {
    imageUrl: string
    meme: MemeEntity
}

@Injectable()
export class IamTelegramService implements TelegramCommand {
    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly dropboxService: DropboxService,
        private readonly randomMemeGetterService: RandomMemeGetterService,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(IamTelegramService.name)
    }

    protected buildMessage(meme: MemeEntity) : string {
        const completeTitle = `⭐ Você é <b>${meme.title}</b>`
        const completeDescription = meme.description ? `<i>${meme.description}</i>` : ""
        const drawTimesText = `🙎🏾 Personificou <b>${meme.drawnTimes}</b> pessoa${meme.drawnTimes > 1 ? "s" : ""}`
        return `\n\n${completeTitle}\n\n${completeDescription}\n\n${drawTimesText}`
    }

    async execute(message: Message) : Promise<IamTelegramResponse> {
        try {
            const randomMeme = await this.randomMemeGetterService.execute()
            if (!randomMeme) {
                await this.telegramBot.sendMessage(message.chat.id, `Ih, ainda não tenho memes! Por enquanto eu ainda não posso criar memes por aqui. Mas dá uma passada lá no Discord e cria uns memes por lá! Quem sabe não aparece aqui 👁️👁️`, { reply_to_message_id: message.message_id })
                return;
            }
            const result = await this.dropboxService.getImage(randomMeme.image)

            this.loggerService.log(`${message?.from?.first_name} ${message?.from?.last_name} getted '${randomMeme.title}'`)

            await this.telegramBot.sendPhoto(message.chat.id, result.link, { 
                caption: this.buildMessage(randomMeme),
                reply_to_message_id: message.message_id,
                parse_mode: "HTML"
            })
        } catch(e) {
            this.loggerService.error(e, e?.stack);
            await this.telegramBot.sendMessage(
                message.chat.id,
                DeniedMessages.getRandomMessage(),
                { reply_to_message_id: message.message_id }
            )
        }
    }
}
