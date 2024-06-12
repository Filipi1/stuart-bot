import * as crypto from 'crypto';
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

    getRandomNumber(max) : number {
        const range = max + 1;
        const maxRange = Math.pow(2, 32) - 1;
        const byteArray = crypto.randomBytes(4);
        return Math.floor(byteArray.readUInt32LE(0) / maxRange * range);
    }

    async execute() : Promise<MemeEntity> {
        const memes = await this.memeRepository.getAllMemes()
        if (!memes || memes.length === 0) {
            this.loggerService.warn("Empty memes!")
            return;
        }
        const randomId = this.getRandomNumber(memes.length)
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
