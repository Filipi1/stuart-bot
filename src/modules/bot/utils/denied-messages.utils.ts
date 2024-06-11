export class DeniedMessages {
    static getRandomMessage() : string {
        const messages = [
            "Você não vai acreditar, mas eu estava no meio do trabalho e meu gato derrubou café em tudo, Pede de novo!",
            "Meu teclado travou justo quando eu estava no escolhendo o meme, acredita? Pede de novo!",
            "Sabe quando você tá super focado e de repente lembra que deixou a panela no fogo? Então... Pede de novo!",
            "Meu pc deu tela azul kkkkkkkkkkkkk... Pede de novo!",
            "Vish tava no tiktok, mas voltei, pede aí de novo"
        ]
        return messages[Math.floor(Math.random() * messages.length)]
    }
}