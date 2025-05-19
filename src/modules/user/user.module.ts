import { Module } from '@nestjs/common';
import { CreateUserService } from './services/domain/create-user/create-user.service';
import { GetUserService } from './services/domain/get-user/get-user.service';
import { GetOrCreateUserService } from './services/application/get-or-create-user/get-or-create-user.service';
import { UserRepository } from './repositories/user.repository';
import { SupabaseUserRepository } from './repositories/supabase-user.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: UserRepository,
      useClass: SupabaseUserRepository
    },
    CreateUserService, 
    GetUserService, 
    GetOrCreateUserService
  ],
  exports: [
    GetOrCreateUserService
  ]
})
export class UserModule {}
