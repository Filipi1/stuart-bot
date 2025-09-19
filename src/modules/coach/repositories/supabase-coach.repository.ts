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
        try {
            console.log('Fetching random coach message...');
            
            // First, let's try a simple query without random ordering to test the connection
            console.log('Testing simple query first...');
            const simpleResult = await this.supabaseService.query<CoachEntity>('coachs', {
                limit: 1
            });
            console.log('Simple query result:', simpleResult);
            
            // Now try the random query
            const result = await this.supabaseService.query<CoachEntity>('coachs', {
                orderBy: 'random()',
                limit: 1
            });
            console.log('Random query result:', result);
            console.log('First result:', result[0]);
            return result[0];
        } catch (error) {
            console.error('Error fetching random coach message:', error);
            throw error;
        }
    }
} 