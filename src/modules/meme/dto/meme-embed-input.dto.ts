import { Attachment } from "discord.js"

export class MemeEmbedInputDTO {
    title: string
    description?: string
    image: string | Attachment
    drawnTimes: number
    isSpoiler: boolean
}