import { Injectable } from '@nestjs/common';
import { UndrawedMemesGetterService } from 'src/modules/meme/services/domain/undrawed-memes-getter/undrawed-memes-getter.service';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';

@Injectable()
export class NobodyamCommandService {

    constructor(
        private readonly loggerService: LoggerService,
        private readonly undrawedMemesGetterService: UndrawedMemesGetterService
    ) {}

    async execute() {
        try {
            const undrawedMemes = await this.undrawedMemesGetterService.execute()
            if (undrawedMemes == 0) {
                return "🥳🎉 Parabéns a todos! Todos os memes já foram personificados."
            }
            return undrawedMemes > 1 
                ? `Existem ${undrawedMemes} memes que ainda não personificaram ninguém!`
                : `Existe ${undrawedMemes} meme que ainda não personificou ninguém!`
        } catch(e) {
            this.loggerService.error(e)
        }
    }
}
