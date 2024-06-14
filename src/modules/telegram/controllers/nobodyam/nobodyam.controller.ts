import { Controller } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';
import { TelegramBotCommand } from '../../decorators/telegram-command.decorator';
import { NobodyamTelegramService } from '../../services/domain/nobodyam-telegram/nobodyam-telegram.service';

@Controller('nobodyam')
export class NobodyamController {
    constructor(private readonly nobodyamTelegramService: NobodyamTelegramService) {}

    @TelegramBotCommand({ command: "ninguemsou", description: "Descubra quantas personificações não incorporaram ninguém!" })
    async handle(message: Message) {
        await this.nobodyamTelegramService.execute(message)
    }
}
