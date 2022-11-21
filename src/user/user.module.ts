import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository } from 'src/repository/follow.repository';
import { SocialInfoRepository } from 'src/repository/social-info.repository';
import { UserRepository } from 'src/repository/user.repository';
import {
  IsBooleanOrNullConstraint,
  IsEmailOrNullConstraint,
  IsUrlOrNullConstraint,
} from 'src/validations/user.validation';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      SocialInfoRepository,
      FollowRepository,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    SocialInfoRepository,
    FollowRepository,
    IsEmailOrNullConstraint,
    IsUrlOrNullConstraint,
    IsBooleanOrNullConstraint,
  ],
})
export class UserModule {}
