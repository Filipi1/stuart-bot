import { Injectable } from '@nestjs/common';
import { MemeRepository } from 'src/modules/meme/repositories/meme.repository';

@Injectable()
export class MemeService {
    constructor(private readonly memeRepository: MemeRepository) {}

    async execute() {
        return await this.memeRepository.getMemeByID({ id: 0 })
    }
}
