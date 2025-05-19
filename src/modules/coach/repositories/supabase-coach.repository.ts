import { Injectable } from "@nestjs/common";
import { CoachEntity } from "../entities/coach.entity";
import { SupabaseService } from "src/modules/shared/services/supabase/supabase.service";

@Injectable()
export class SupabaseCoachRepository {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}

    async create(entity: CoachEntity): Promise<void> {
        await this.supabaseService.insert<CoachEntity>('coachs', entity);
    }

    async getRandomCoachMessage(): Promise<CoachEntity> {
        const result = await this.supabaseService.query<CoachEntity>('coachs', {
            orderBy: 'random()',
            limit: 1
        });
        return result[0];
    }
} 