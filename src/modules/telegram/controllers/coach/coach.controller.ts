import { Message } from 'node-telegram-bot-api';
import { TelegramBotCommand } from '../../decorators/telegram-command.decorator';
import { Controller } from '@nestjs/common';
import { CoachTelegramService } from '../../services/domain/coach-telegram/coach-telegram.service';

@Controller('coach')
export class CoachController {
    constructor(private readonly coachTelegramService: CoachTelegramService) {}

    @TelegramBotCommand({ command: "coach", description: "Eu te direi uma mensagem motivadora!" })
    async handle(message: Message) : Promise<void> {
        await this.coachTelegramService.execute(message)
    }
}
