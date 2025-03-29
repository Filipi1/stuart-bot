import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class GetUserService {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>) : Promise<UserEntity> {
        return await this.userRepository.get_one(user)
    }
}
