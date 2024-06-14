import { Module } from '@nestjs/common';
import { CoachRepository } from './repositories/coach.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachEntity } from './entities/coach.entity';
import { GetRandomCoachMessageService } from './services/domain/get-random-coach-message/get-random-coach-message.service';
import { CreateCoachMessageService } from './services/domain/create-coach-message/create-coach-message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CoachEntity])
    ],
    providers: [
        CoachRepository,
        GetRandomCoachMessageService,
        CreateCoachMessageService
    ],
    exports: [
        GetRandomCoachMessageService,
        CreateCoachMessageService
    ]
})
export class CoachModule {}
