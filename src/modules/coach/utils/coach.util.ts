export class CoachUtil {
    static formatHTMLMessage(message: string, author: string) : string {
        const coachMessage = `<i>${message}</i> 🍃`
        const fullMessage = author ? `${coachMessage}\n\n - ${author}` : coachMessage
        return fullMessage
    }

    static getMessageAndAuthorByMessage(message: string) {
        const unformatedMessage = message
            .replaceAll("🍃", "")
            .replaceAll("<i>", "")
            .replaceAll("</i>", "")
            .replaceAll("/n", "")

        return {
            message: unformatedMessage.split("-")[0].trim(),
            author:  unformatedMessage.split("-")[1].trim(),
        }
    }
}