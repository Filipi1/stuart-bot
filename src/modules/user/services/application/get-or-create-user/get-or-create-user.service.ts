import { Injectable } from '@nestjs/common';
import { GetUserService } from '../../domain/get-user/get-user.service';
import { CreateUserService } from '../../domain/create-user/create-user.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class GetOrCreateUserService {
    constructor(
        private readonly getUserService: GetUserService,
        private readonly createUserService: CreateUserService
    ) {}

    async execute(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>) : Promise<UserEntity>{
        const newUser = await this.getUserService.execute(user)
        if (!newUser) {
            return await this.createUserService.execute(user)
        }
        return newUser
    }
}
