import { Repository } from "typeorm";
import { MemeEntity } from "../entities/meme.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class MemeRepository {
    constructor(
        @InjectRepository(MemeEntity)
        private readonly repository: Repository<MemeEntity>
    ) {}

    async getMemeByID(where: Pick<MemeEntity, 'id'>) : Promise<MemeEntity> {
       return await this.repository.findOne({where: where})
    }

    async getAllMemes() : Promise<MemeEntity[]> {
        return await this.repository.find()
    }

    async update(entity: MemeEntity) : Promise<MemeEntity> {
        await this.repository.update({ id: entity.id }, entity)
        return this.getMemeByID({ id: entity.id })
    }

    async save(entity: MemeEntity) : Promise<MemeEntity> {
        return this.repository.save(entity)
    }
}