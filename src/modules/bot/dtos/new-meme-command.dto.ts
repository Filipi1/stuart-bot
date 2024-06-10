import { Param } from '@discord-nestjs/core';

export class NewMemeCommandInputDTO {
    @Param({
        description: 'Título do seu meme, lembre-se: Todos os memes começam com "Você é" (Ex: o Pensador, o Stuartiano)',
        required: true,
        name: 'title',
    })
    title: string

    @Param({
        description: 'Descrição do meme, ficará logo abaixo do título do seu meme',
        required: false,
        name: 'description',
    })
    description: string
}