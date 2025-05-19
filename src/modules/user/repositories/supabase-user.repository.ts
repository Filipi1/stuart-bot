import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { SupabaseService } from "src/modules/shared/services/supabase/supabase.service";

@Injectable()
export class SupabaseUserRepository {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}

    async get_one(entity: Pick<UserEntity, 'identifier'>): Promise<UserEntity> {
        const result = await this.supabaseService.query<UserEntity>('users', {
            where: { identifier: entity.identifier }
        });
        return result[0];
    }

    async create(entity: UserEntity): Promise<UserEntity> {
        return await this.supabaseService.insert<UserEntity>('users', entity);
    }
} 