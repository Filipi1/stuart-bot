import { Module } from '@nestjs/common';
import { CoachRepository } from './repositories/coach.repository';
import { SupabaseCoachRepository } from './repositories/supabase-coach.repository';
import { GetRandomCoachMessageService } from './services/domain/get-random-coach-message/get-random-coach-message.service';
import { CreateCoachMessageService } from './services/domain/create-coach-message/create-coach-message.service';

@Module({
    imports: [],
    providers: [
        {
            provide: CoachRepository,
            useClass: SupabaseCoachRepository
        },
        GetRandomCoachMessageService,
        CreateCoachMessageService
    ],
    exports: [
        GetRandomCoachMessageService,
        CreateCoachMessageService
    ]
})
export class CoachModule {}
