import { Injectable } from '@nestjs/common';
import { MemeEntity } from 'src/modules/meme/entities/meme.entity';
import { MemeRepository } from 'src/modules/meme/repositories/meme.repository';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

@Injectable()
export class RandomMemeGetterService {
    constructor(
        private readonly memeRepository: MemeRepository,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(RandomMemeGetterService.name)
    }

    async execute() : Promise<MemeEntity> {
        const memes = await this.memeRepository.getAllMemes()
        if (!memes || memes.length === 0) {
            this.loggerService.warn("Empty memes!")
            return;
        }
        const randomId = Math.floor(Math.random() * memes.length)
        const selectedMeme = memes[randomId]
        if (!selectedMeme) {
            this.loggerService.warn(`Meme for '${randomId}' not founded, retrying...`)
            return this.execute()
        }
        const updatedMeme = await this.memeRepository.update({
            drawnTimes: selectedMeme.drawnTimes++,
            ...selectedMeme
        })
        this.loggerService.log(`Increased drawnTimes for '${randomId}'`)
        return updatedMeme
    }
}
