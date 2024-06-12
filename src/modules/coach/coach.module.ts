import { Module } from '@nestjs/common';
import { CoachRepository } from './repositories/coach.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachEntity } from './entities/coach.entity';
import { GetRandomCoachMessageService } from './services/domain/get-random-coach-message/get-random-coach-message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CoachEntity])
    ],
    providers: [
        CoachRepository,
        GetRandomCoachMessageService
    ],
    exports: [
        GetRandomCoachMessageService
    ]
})
export class CoachModule {}
