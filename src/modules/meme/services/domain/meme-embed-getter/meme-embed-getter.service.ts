import { Injectable } from '@nestjs/common';
import { Attachment, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { MemeEmbedInputDTO } from 'src/modules/meme/dto/meme-embed-input.dto';

interface MemeEmbedGetterResponse {
    embed: EmbedBuilder,
    attachment?: AttachmentBuilder
}

@Injectable()
export class MemeEmbedGetterService {

    spoilerBypass(message: string, hide: boolean) : string {
        if (hide && message) {
            return `||${message}||`
        }

        return message;
    }

    execute(input: MemeEmbedInputDTO) : MemeEmbedGetterResponse {
        if (input.image instanceof Attachment) {
            const imageName = input.isSpoiler ? `SPOILER_${input.image.name}` : input.image.name;
            let attachment = new AttachmentBuilder(input.image.url, { name: imageName });
            const embed = new EmbedBuilder({
                title: this.spoilerBypass(`Você é ${input.title}`, input.isSpoiler),
                description: this.spoilerBypass(input.description, input.isSpoiler),
                footer: {
                    text: `Personificou ${input.drawnTimes} ${input.drawnTimes > 1 ? "pessoas" : "pessoa"}`,
                    icon_url: "https://cdn1.iconfinder.com/data/icons/ui-colored-1-of-3/100/UI_1__11-1024.png"
                }
            }).setImage("https://i.postimg.cc/W1n8HC1w/Meme-Place-Holder.jpg")
            if (!input.isSpoiler) {
                embed.setImage(`attachment://${imageName}`)
            }

            return {
                embed: embed,
                attachment: input.isSpoiler ? null : attachment
            }
        }
        
        return {
            embed: new EmbedBuilder({
                title: this.spoilerBypass(`Você! é ${input.title}`, input.isSpoiler),
                description: this.spoilerBypass(input.description, input.isSpoiler),
                image: input.isSpoiler ? { url: "https://i.postimg.cc/W1n8HC1w/Meme-Place-Holder.jpg" } : { url: input.image },
                footer: {
                    text: `Personificou ${input.drawnTimes} ${input.drawnTimes > 1 ? "pessoas" : "pessoa"}`,
                    icon_url: "https://cdn1.iconfinder.com/data/icons/ui-colored-1-of-3/100/UI_1__11-1024.png"
                }
            }),
            attachment: null
        }
    }
}
