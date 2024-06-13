import { Injectable } from '@nestjs/common';
import { CoachEntity } from 'src/modules/coach/entities/coach.entity';
import { CoachRepository } from 'src/modules/coach/repositories/coach.repository';
import { LoggerService } from 'src/modules/shared/services/logger/logger.service';
import { CreateCoachMessageInput } from './interfaces/create-coach-message-input.interface';

@Injectable()
export class CreateCoachMessageService {
    constructor(
        private readonly coachRepository: CoachRepository,
        private readonly loggerService: LoggerService
    ) {
        this.loggerService.setContext(CreateCoachMessageService.name)
    }

    async execute(input: CreateCoachMessageInput) {
        const newCoachMessage = CoachEntity.create({
            message: input.title,
            author: input.author
        })
        this.loggerService.log("Creating new coach message...")
        await this.coachRepository.create(newCoachMessage)
        this.loggerService.log("Created!")
    }
}
