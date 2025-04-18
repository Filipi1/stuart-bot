import { Param, ParamType } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';

export class AudioMemeCommandInputDTO {
    @Transform(({ value }) => value?.trim())
    @Param({
        name: 'nome',
        description: 'Nome do áudio que você quer tocar',
        required: true,
        type: ParamType.STRING
    })
    nome: string;
} 