import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { MemeEntity } from 'src/modules/meme/entities/meme.entity';
import { RandomMemeGetterService } from 'src/modules/meme/services/domain/random-meme-getter/random-meme-getter.service';
import { DropboxService } from 'src/modules/shared/services/dropbox/dropbox.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';
import { TelegramCommand } from 'src/modules/telegram/interfaces/telegram-command.interface';

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

    async execute(message: Message) : Promise<IamTelegramResponse> {
        const randomMeme = await this.randomMemeGetterService.execute()
        if (!randomMeme) {
            await this.telegramBot.sendMessage(message.chat.id, `Ih, ainda não tenho memes! Por enquanto eu ainda não posso criar memes por aqui. Mas dá uma passada lá no Discord e cria uns memes por lá! Quem sabe não aparece aqui 👁️👁️`, { reply_to_message_id: message.message_id })
            return;
        }
        const result = await this.dropboxService.getImage(randomMeme.image)

        await this.telegramBot.sendPhoto(message.chat.id, result.link, { 
            caption: randomMeme.description 
                ? `\n\n⭐ Você é ${randomMeme.title}\n\n${randomMeme.description}\n\n🙎🏾 Personificou ${randomMeme.drawnTimes} pessoas`
                : `\n\n⭐ Você é ${randomMeme.title}\n\nPersonificou ${randomMeme.drawnTimes} pessoas`,
            reply_to_message_id: message.message_id,
        })
    }
}
