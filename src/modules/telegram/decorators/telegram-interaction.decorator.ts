import { applyDecorators } from "@nestjs/common";
import { TelegramBotInteractionOptions } from "../interfaces/telegram-bot-interaction-options.interface";
import { EventPattern } from "@nestjs/microservices";

export function TelegramInteractionListener(options: TelegramBotInteractionOptions) {
	return applyDecorators(EventPattern({...options, type: TelegramInteractionListener.name}));
}