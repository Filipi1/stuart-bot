import { Provider } from "@nestjs/common";
import { AppEnvironment } from "src/modules/shared/enums/app-environment.enum";

import * as TelegramBot from 'node-telegram-bot-api';
import { LoggerService } from "src/modules/shared/services/logger/logger.service";
import { TelegramProviders } from "../enums/telegram-providers.enum";

export const TelegramBotProvider : Provider = {
    provide: TelegramProviders.bot,
    useFactory: (token: string, logger: LoggerService) => {
      const bot = new TelegramBot(token, { polling: true });
      logger.setContext("TelegramBotProvider")
      logger.warn(`Telegram Bot - was started`)
      return bot;
    },
    inject: [AppEnvironment.TELEGRAM_TOKEN, LoggerService]
}