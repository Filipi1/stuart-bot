import { Injectable } from '@nestjs/common';
import { MemeRepository } from 'src/modules/meme/repositories/meme.repository';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

@Injectable()
export class UndrawedMemesGetterService {
    constructor(
        private readonly memeRepository: MemeRepository,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(UndrawedMemesGetterService.name)
    }

    async execute() : Promise<number> {
        const undrawedMemes = await this.memeRepository.getUndrawedMemesCount()
        this.loggerService.log(`WOW! getted ${undrawedMemes} memes!`)
        return this.memeRepository.getUndrawedMemesCount()
    }
}
