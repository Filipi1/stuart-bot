import { Module } from '@nestjs/common';
import { CreateUserService } from './services/domain/create-user/create-user.service';
import { GetUserService } from './services/domain/get-user/get-user.service';
import { GetOrCreateUserService } from './services/application/get-or-create-user/get-or-create-user.service';
import { UserRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [
    UserRepository,
    CreateUserService, 
    GetUserService, 
    GetOrCreateUserService
  ],
  exports: [
    GetOrCreateUserService
  ]
})
export class UserModule {}
