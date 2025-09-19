import { EmbedBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import { AttachmentBuilder } from 'discord.js';
import { RandomMemeGetterService } from 'src/modules/meme/services/domain/random-meme-getter/random-meme-getter.service';
import { DropboxService } from 'src/modules/shared/services/dropbox/dropbox.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

interface IamCommandResponse {
    meme_id: number,
    embed: EmbedBuilder,
    attachment: AttachmentBuilder
}

@Injectable()
export class IamCommandService {
    constructor(
        private readonly dropboxService: DropboxService,
        private readonly randomMemeGetterService: RandomMemeGetterService,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(IamCommandService.name)
    }

    async execute(userId: number) : Promise<IamCommandResponse> {
        const randomMeme = await this.randomMemeGetterService.execute(userId)
        if (!randomMeme) {
            return;
        }
        const result = await this.dropboxService.getImage(randomMeme.image)
        const attachment = new AttachmentBuilder(result.link, { name: randomMeme.image })
        return {
            meme_id: randomMeme.id,
            embed: new EmbedBuilder({
                title: `Você é ${randomMeme.title}`,
                description: randomMeme.description,
                footer: {
                    text: `Personificou ${randomMeme.drawnTimes} ${randomMeme.drawnTimes > 1 ? "pessoas" : "pessoa"}`,
                    icon_url: "https://cdn1.iconfinder.com/data/icons/ui-colored-1-of-3/100/UI_1__11-1024.png"
                }
            }).setImage(`attachment://${randomMeme.image}`),
            attachment: attachment
        }
    }
}
