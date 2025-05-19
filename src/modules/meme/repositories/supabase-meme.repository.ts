import { Injectable } from "@nestjs/common";
import { MemeEntity } from "../entities/meme.entity";
import { SupabaseService } from "src/modules/shared/services/supabase/supabase.service";

@Injectable()
export class SupabaseMemeRepository {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}

    async getMemeByID(where: Pick<MemeEntity, 'id'>): Promise<MemeEntity> {
        const result = await this.supabaseService.query<MemeEntity>('memes', {
            where: { id: where.id }
        });
        return result[0];
    }

    async getAllMemes(): Promise<MemeEntity[]> {
        return await this.supabaseService.query<MemeEntity>('memes');
    }

    async getUndrawedMemesCount(): Promise<number> {
        const result = await this.supabaseService.query<MemeEntity>('memes', {
            where: { drawnTimes: 0 }
        });
        return result.length;
    }

    async update(entity: MemeEntity): Promise<MemeEntity> {
        return await this.supabaseService.update<MemeEntity>('memes', entity.id, entity);
    }

    async save(entity: MemeEntity): Promise<MemeEntity> {
        return await this.supabaseService.insert<MemeEntity>('memes', entity);
    }
} 