import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { ActivityType, Attachment, Client } from 'discord.js';
import { MemeEntity } from 'src/modules/meme/entities/meme.entity';
import { MemeRepository } from 'src/modules/meme/repositories/meme.repository';
import { DropboxService } from 'src/modules/shared/services/dropbox/dropbox.service';
import { SupportedImageFormats } from 'src/modules/shared/services/dropbox/enums/image_format.enum';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

interface MemeCreatorInput {
    title: string
    description?: string
    image: Attachment
}

@Injectable()
export class MemeCreatorService {
    constructor(
        @InjectDiscordClient()
        private readonly client: Client,
        private readonly dropboxService: DropboxService,
        private readonly memeRepository: MemeRepository,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(MemeCreatorService.name)
    }

    async execute(input: MemeCreatorInput) {
        const imageFormat = input.image.name.split(".").length > 1 ? input.image.name.split(".")[1] : null;
        if (!imageFormat || !SupportedImageFormats.includes("image/" + imageFormat)) {
            throw Error("Invalid upload image format.")
        }
        this.loggerService.log(`Fazendo upload da nova imagem ${input.image.name}`)
        const uploadedImage = await this.dropboxService.uploadImage(input.image.url, imageFormat)
        const meme = MemeEntity.create({
            title: input.title,
            description: input.description,
            image: uploadedImage.name
        })
        this.loggerService.log(`Criando o novo meme [${input.title} : ${input.description}]`)
        await this.memeRepository.save(meme)
        const allMemes = await this.memeRepository.getAllMemes()
        this.client.user.setActivity(`${allMemes.length} memes.`, { type: ActivityType.Playing })
        this.loggerService.log("Meme criado!")
    }
}
