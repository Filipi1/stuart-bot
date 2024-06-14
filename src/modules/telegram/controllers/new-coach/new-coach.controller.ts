import { Controller } from '@nestjs/common';
import { NewCoachTelegramService } from '../../services/domain/new-coach-telegram/new-coach-telegram.service';
import { CallbackQuery, Message } from 'node-telegram-bot-api';
import { TelegramBotCommand } from '../../decorators/telegram-command.decorator';
import { TelegramInteractionListener } from '../../decorators/telegram-interaction.decorator';

@Controller('new-coach')
export class NewCoachController {
    constructor(private readonly newCoachTelegramService: NewCoachTelegramService) {}

    @TelegramBotCommand({ command: "novocoach", description: "Cria uma nova mensagem que poderá ser obtida aleatóriamente pelo comando /coach" })
    async handle(message: Message) {
        await this.newCoachTelegramService.execute(message);
    }
    
    @TelegramInteractionListener({ identifier: "novocoach" })
    async onInteraction(callback: CallbackQuery) {
        await this.newCoachTelegramService.create(callback)
    }
}
