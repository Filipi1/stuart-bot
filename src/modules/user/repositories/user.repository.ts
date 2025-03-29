import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>
    ) {}

    async get_one(entity: Pick<UserEntity, 'identifier'>) : Promise<UserEntity> {
        return await this.repository.findOneBy({
            identifier: entity.identifier
        })
    }

    async create(entity: UserEntity) : Promise<UserEntity> {
        await this.repository.insert(entity)
        return this.get_one({ identifier: entity.identifier })
    }
}