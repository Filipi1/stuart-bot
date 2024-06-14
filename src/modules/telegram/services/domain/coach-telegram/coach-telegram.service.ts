import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { DeniedMessages } from 'src/modules/bot/utils/denied-messages.utils';
import { GetRandomCoachMessageService } from 'src/modules/coach/services/domain/get-random-coach-message/get-random-coach-message.service';
import { CoachUtil } from 'src/modules/coach/utils/coach.util';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';

@Injectable()
export class CoachTelegramService {
    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly getRandomCoachMessageService: GetRandomCoachMessageService,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(CoachTelegramService.name)
    }

    async execute(message: Message) {
        try {
            const coach = await this.getRandomCoachMessageService.execute()
            this.loggerService.log(`${message.from.first_name} getted "${coach.message} = ${coach.author}"`)
            await this.telegramBot.sendMessage(
                message.chat.id, 
                CoachUtil.formatHTMLMessage(coach.message, coach.author), 
                {
                    reply_to_message_id: message.message_id,
                    parse_mode: "HTML"
                }
            )
        } catch (e) {
            this.loggerService.error(e, e?.stack);
            await this.telegramBot.sendMessage(
                message.chat.id,
                DeniedMessages.getRandomMessage(),
                { reply_to_message_id: message.message_id }
            )
        }
    }
}
