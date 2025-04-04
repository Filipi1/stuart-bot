import { Param, ParamType } from '@discord-nestjs/core';
import { Transform } from 'class-transformer';

export class ChatCommandInputDTO {
    @Transform(({ value }) => value?.trim())
    @Param({
        name: 'mensagem',
        description: 'Pergunte algo ao stuart.',
        required: true,
        type: ParamType.STRING
    })
    mensagem: string;
} 