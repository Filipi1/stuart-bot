import { Injectable } from "@nestjs/common";
import { MemeEntity } from "../entities/meme.entity";
import { SupabaseService } from "src/modules/shared/services/supabase/supabase.service";
import { EarnedMemeEntity } from "../entities/earned-meme.entity";

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

    async registerMemeDraw(userId: number, memeId: number) : Promise<EarnedMemeEntity> {
        const result = await this.supabaseService.query<EarnedMemeEntity>('earned_memes', {
            where: { userId: userId, memeId: memeId }
        });

        if (result.length === 0) {
            return await this.supabaseService.insert<EarnedMemeEntity>('earned_memes', EarnedMemeEntity.create({
                memeId: memeId,
                userId: userId
            }));
        }

        result[0].earnedTimes++;
        return await this.supabaseService.update<EarnedMemeEntity>('earned_memes', result[0].id, result[0]);
    }

    async update(entity: MemeEntity): Promise<MemeEntity> {
        return await this.supabaseService.update<MemeEntity>('memes', entity.id, entity);
    }

    async save(entity: MemeEntity): Promise<MemeEntity> {
        return await this.supabaseService.insert<MemeEntity>('memes', entity).catch(
            error => {
                console.log(error)
                throw error
            }
        );
    }
} 