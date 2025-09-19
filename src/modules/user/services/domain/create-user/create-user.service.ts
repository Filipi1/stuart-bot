import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class CreateUserService {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(user: Omit<UserEntity, 'id' | 'token' | 'createdAt' | 'updatedAt'>) : Promise<UserEntity>{
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        return await this.userRepository.create(UserEntity.create({...user, token}))
    }
}
