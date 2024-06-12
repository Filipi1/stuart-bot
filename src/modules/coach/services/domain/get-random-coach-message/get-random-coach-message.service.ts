import { Injectable } from '@nestjs/common';
import { CoachEntity } from 'src/modules/coach/entities/coach.entity';
import { CoachRepository } from 'src/modules/coach/repositories/coach.repository';

@Injectable()
export class GetRandomCoachMessageService {
    constructor(private readonly coachRepository: CoachRepository) {}

    async execute() : Promise<CoachEntity> {
        return await this.coachRepository.getRandomCoachMessage();
    }
}
