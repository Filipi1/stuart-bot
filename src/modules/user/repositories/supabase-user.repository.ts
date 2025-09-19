import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { SupabaseService } from "src/modules/shared/services/supabase/supabase.service";

@Injectable()
export class SupabaseUserRepository {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}

    async get_one(entity: Pick<UserEntity, 'username'>): Promise<UserEntity | null> {
        const result = await this.supabaseService.query<UserEntity>('users', {
            where: { username: entity.username }
        });

        if (result.length === 0) {
            return null;
        }

        return result[0];
    }

    async get_or_create(entity: Pick<UserEntity, 'username' | 'displayName' | 'token'>): Promise<UserEntity> {
        const user = await this.get_one(entity);
        if (!user) {
            return await this.create(UserEntity.create({
                username: entity.username,
                displayName: entity.displayName,
                token: entity.token
            }));
        }
        return user;
    }

    async create(entity: UserEntity): Promise<UserEntity> {
        return await this.supabaseService.insert<UserEntity>('users', entity);
    }
} 