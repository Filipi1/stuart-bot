import { Controller } from '@nestjs/common';
import { TelegramBotCommand } from '../../decorators/telegram-command.decorator';
import { IamTelegramResponse, IamTelegramService } from '../../services/domain/iam-telegram/iam-telegram.service';
import { Message } from 'node-telegram-bot-api';

@Controller('iam')
export class IamController {
    constructor(private readonly iamTelegramService: IamTelegramService) {}

    @TelegramBotCommand({ command: "eusou", description: "Mostra sua personificação do momento." })
    async handle(message: Message) : Promise<IamTelegramResponse> {
        return this.iamTelegramService.execute(message)
    }
}
