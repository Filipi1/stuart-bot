import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { GetRandomCoachMessageService } from 'src/modules/coach/services/domain/get-random-coach-message/get-random-coach-message.service';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';

@Injectable()
export class CoachTelegramService {
    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly getRandomCoachMessageService: GetRandomCoachMessageService,
    ) {}

    async execute(message: Message) {
        const coach = await this.getRandomCoachMessageService.execute()
        const coachMessage = `<i>${coach.message}</i> 🍃`
        const fullMessage = coach.author ? `${coachMessage}\n\n - ${coach.author}` : coachMessage
        await this.telegramBot.sendMessage(message.chat.id, fullMessage, {
            reply_to_message_id: message.message_id,
            parse_mode: "HTML"
        })
    }
}
