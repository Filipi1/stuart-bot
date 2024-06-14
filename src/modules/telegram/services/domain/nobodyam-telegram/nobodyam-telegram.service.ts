import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { DeniedMessages } from 'src/modules/bot/utils/denied-messages.utils';
import { UndrawedMemesGetterService } from 'src/modules/meme/services/domain/undrawed-memes-getter/undrawed-memes-getter.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';

@Injectable()
export class NobodyamTelegramService {

    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly undrawedMemesGetterService: UndrawedMemesGetterService,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(NobodyamTelegramService.name)
    }

    async execute(message: Message) {
        try {
            const undrawedMemes = await this.undrawedMemesGetterService.execute()
            if (undrawedMemes == 0) {
                await this.telegramBot.sendMessage(
                    message.chat.id, 
                    "🥳🎉 Parabéns a todos! Todos os memes já foram personificados.",
                    {
                        reply_to_message_id: message.message_id
                    }
                )
                return;
            }
            const responseMessage = undrawedMemes > 1 
                ? `${message.from.first_name}, existem <b>${undrawedMemes}</b> memes que ainda não personificaram ninguém!`
                : `${message.from.first_name}, existe <b>${undrawedMemes}</b> meme que ainda não personificou ninguém!`

            await this.telegramBot.sendMessage(
                message.chat.id, 
                responseMessage,
                {
                    reply_to_message_id: message.message_id,
                    parse_mode: "HTML"
                }
            )
        } catch(e) {
            this.loggerService.error(e)
            await this.telegramBot.sendMessage(
                message.chat.id, 
                DeniedMessages.getRandomMessage()
            )
        }
    }
}
