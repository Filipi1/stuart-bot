import { Injectable } from '@nestjs/common';
import { NewMemeCommandInputDTO } from 'src/modules/bot/dtos/new-meme-command.dto';

@Injectable()
export class NewMemeCommandService {
    async execute(newMemeCommandInputDTO: NewMemeCommandInputDTO) {
        return 'OK'
    }
}
