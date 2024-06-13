import { Repository } from "typeorm";
import { CoachEntity } from "../entities/coach.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CoachRepository {
    constructor(
        @InjectRepository(CoachEntity)
        private readonly repository: Repository<CoachEntity>
    ) {}

    async create(entity: CoachEntity) : Promise<void> {
        await this.repository.insert(entity)
    }

    async getRandomCoachMessage() : Promise<CoachEntity> {
        const result = await this.repository.createQueryBuilder()
            .select()
            .orderBy("RAND()")
            .limit(1)
            .getOne()
        return result
    }
}