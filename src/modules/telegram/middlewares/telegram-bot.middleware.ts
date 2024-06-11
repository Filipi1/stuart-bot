import { Inject } from '@nestjs/common';
import { CustomTransportStrategy, MessageHandler, Server } from '@nestjs/microservices';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

import TelegramBot, { Message, Metadata } from 'node-telegram-bot-api';
import { TelegramBotCommand } from '../decorators/telegram-command.decorator';
import { TelegramBotCommandOptions } from '../interfaces/telegram-bot-command-options.interface';
import { firstValueFrom, isObservable } from 'rxjs';
import { TelegramProviders } from '../enums/telegram-providers.enum';

export class TelegramMiddlewareServer extends Server implements CustomTransportStrategy {
    private telegramCommands: Map<string, MessageHandler> = new Map<string, MessageHandler>();
    private telegramCommandsOptions: Map<string, TelegramBotCommandOptions> = new Map<string, TelegramBotCommandOptions>();

    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly loggerService: LoggerService
    ) {
        super();
        this.loggerService.setContext(TelegramMiddlewareServer.name);
    }

    protected messageGetCommand(message: Message) : string {
        const isBotCommand = message?.entities?.findIndex((entity) => entity.type == "bot_command") != -1;
        if (!isBotCommand) {
            return null;
        }

        let command = message.text?.split("/")[1]
        if (command.includes("@")) {
            command = command.split("@")[0]
        }
        return command
    }

    protected async onMessage(message: Message, metadata: Metadata) {
        const isText = metadata.type === "text";
        if (!isText) {
            return;
        }
        const command = this.messageGetCommand(message)
        if (this.telegramCommands.get(command)) {
            console.time("Telegram Command Duration")
            this.loggerService.warn(`Requested in Server: ${message?.chat?.title ?? "Private"}`)
            this.loggerService.log(`${message?.from?.first_name} ${message?.from?.last_name} requested /${command} command`)
            const handler = this.telegramCommands.get(command);
            const result = await handler(message)
            if (isObservable(result)) {
                await firstValueFrom(result, {
                  defaultValue: 0,
                });
            }
            console.timeEnd("Telegram Command Duration")
        }
    }

    protected setCommandsWiki() {
        const currentCommands = Array.from(this.telegramCommandsOptions.values())
        this.telegramBot.setMyCommands(currentCommands.map(option => ({ command: option.command, description: option.description })))
    }

    async listen(callback: () => void) {
        this.messageHandlers.forEach(async (handler, options) => {
            if (handler.isEventHandler && options) {
                const jsonOptions: object = JSON.parse(options)
                jsonOptions.hasOwnProperty("type")
                if (jsonOptions.hasOwnProperty("type") && jsonOptions["type"] === TelegramBotCommand.name) {
                    const commandOptions = jsonOptions as TelegramBotCommandOptions
                    this.logger.log(`TELEGRAM BOT - COMMAND "/${commandOptions.command}" SUCCESSFULLY INITIALIZED`)
                    this.telegramCommands.set(commandOptions.command, handler)
                    this.telegramCommandsOptions.set(commandOptions.command, commandOptions)
                }
            }
        })
        this.setCommandsWiki() 
        this.telegramBot.on("message", (m, md) => this.onMessage(m, md))
        this.logger.warn(`TELEGRAM BOT - ${(await this.telegramBot.getMe()).first_name} settings completed`)
        callback();
    }

    close() {
        this.telegramBot.close()
        this.loggerService.log("TELEGRAM BOT - Closed bot connection")
    }
}
