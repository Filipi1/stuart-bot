import { ButtonCallback } from "../interfaces/telegram-button-interaction.interface"

export class NewCoachButtonCallback implements ButtonCallback {
    command: string
    confirmed: boolean

    toString() {
        return JSON.stringify({ 
            command: this.command, 
            confirmed: this.confirmed
        })
    }

    static fromString(entity: string) : NewCoachButtonCallback{
        const sut = new NewCoachButtonCallback()
        const result = JSON.parse(entity)
        return Object.assign(sut, result)
    }
}