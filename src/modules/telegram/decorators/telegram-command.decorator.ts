import { applyDecorators } from "@nestjs/common";
import { TelegramBotCommandOptions } from "../interfaces/telegram-bot-command-options.interface";
import { EventPattern } from "@nestjs/microservices";

export function TelegramBotCommand(options: TelegramBotCommandOptions) {
	return applyDecorators(EventPattern({...options, type: TelegramBotCommand.name}));
}