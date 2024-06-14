import { Inject, Injectable } from '@nestjs/common';
import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import { DeniedMessages } from 'src/modules/bot/utils/denied-messages.utils';
import { CreateCoachMessageService } from 'src/modules/coach/services/domain/create-coach-message/create-coach-message.service';
import { CoachUtil } from 'src/modules/coach/utils/coach.util';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { NewCoachButtonCallback } from 'src/modules/telegram/dataclass/new-coach-button-callback.dataclass';
import { TelegramProviders } from 'src/modules/telegram/enums/telegram-providers.enum';


@Injectable()
export class NewCoachTelegramService {
    constructor(
        @Inject(TelegramProviders.bot) private readonly telegramBot: TelegramBot,
        private readonly createCoachMessageService: CreateCoachMessageService,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(NewCoachTelegramService.name)
    }

    async create(callback: CallbackQuery) {
        try {
            const data = NewCoachButtonCallback.fromString(callback.data)
            if (data.confirmed) {
                const coachMessage = callback.message.text
                const coachData = CoachUtil.getMessageAndAuthorByMessage(coachMessage.split(":")[1])
                await this.telegramBot.sendChatAction(callback.message.chat.id, "typing")
                await this.telegramBot.editMessageText(
                    "Ok, criando sua frase...", 
                    { 
                        message_id: callback.message.message_id,
                        chat_id: callback.message.chat.id
                    }
                )
                await this.createCoachMessageService.execute({
                    title: coachData.message,
                    author: coachData.author
                })
                await this.telegramBot.editMessageText(
                    "Sua frase irá quem sabe um dia, transformar o dia de alguém! 🍃", 
                    { 
                        message_id: callback.message.message_id,
                        chat_id: callback.message.chat.id
                    }
                )
                return;
            }

            await this.telegramBot.editMessageText(
                "Ok, frase descartada, comece novamente com /novocoach", 
                { 
                    message_id: callback.message.message_id,
                    chat_id: callback.message.chat.id
                }
            )
        } catch (e) {
            this.loggerService.error(e)
            await this.telegramBot.editMessageText(
                DeniedMessages.getRandomMessage(), 
                { 
                    message_id: callback.message.message_id,
                    chat_id: callback.message.chat.id
                }
            )
        }
    }

    async execute(message: Message) {
        const firstQuestionMessage = await this.telegramBot.sendMessage(
            message.chat.id,
            "Uau! Está se sentindo inspirado hoje? Responda essa mensagem com a sua frase inspiradora! (ou não, rsrs)\n\nPor exemplo:\nUm filósofo uma vez disse: Não fique estressadinha calma amor não se exponha. - Carl Max\n\n⚠️ Lembre-se de manter essa estrutura -> mensagem - autor <-",
            { 
                reply_to_message_id: message.message_id
            }
        )

        this.telegramBot.onReplyToMessage(
            firstQuestionMessage.chat.id,
            firstQuestionMessage.message_id,
            async (userResponse) => {
                if (!userResponse.text?.includes("-")) {
                    await this.telegramBot.sendMessage(
                        message.chat.id,
                        "Não consegui identificar o autor dessa linda frase.\n\n⚠️ Lembre-se de manter essa estrutura -> mensagem - autor <-\n\nResponda novamente a primeira mensagem para tentar novamente!",
                        { 
                            reply_to_message_id: userResponse.message_id
                        }
                    )
                    return;
                }
                
                const newCoachMessage = userResponse.text.split("-")[0].trim().replaceAll('"', "")
                const newCoachAuthor = userResponse.text.split("-")[1].trim().replaceAll('"', "")

                if (newCoachAuthor.split(" ").length != 2) {
                    await this.telegramBot.sendMessage(
                        message.chat.id,
                        "O Autor deve ter apenas nome e sobrenome: \n\n❌ Paulo\n❌ Paulo Alves Barbosa \n✔️ Paulo Alves \n\nResponda novamente a primeira mensagem para tentar novamente!",
                        { 
                            reply_to_message_id: userResponse.message_id
                        }
                    )
                    return;
                }

                await this.telegramBot.deleteMessage(firstQuestionMessage.chat.id, firstQuestionMessage.message_id)
                await this.telegramBot.sendMessage(
                    message.chat.id,
                    `Sua frase ficará da seguinte forma: \n\n${CoachUtil.formatHTMLMessage(newCoachMessage, newCoachAuthor)}`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "Isso aí!",
                                        callback_data: JSON.stringify({ command: "novocoach", confirmed: true })
                                    },
                                    {
                                        text: "Ah, esquece!",
                                        callback_data: JSON.stringify({ command: "novocoach", confirmed: false })
                                    }
                                ]
                            ]
                        },
                        reply_to_message_id: message.message_id,
                        parse_mode: 'HTML'
                    }
                );
            }
        )
    }
}
