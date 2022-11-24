import { PickType } from '@nestjs/mapped-types';
import { Allow, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateSocialUserDto extends PickType(CreateUserDto, [
  'name',
  'login_id',
  'about_me',
] as const) {
  @IsOptional()
  email?: string;

  @Allow()
  profile_image: string;

  @IsEnum(['google', 'github', 'facebook'])
  provider: string;
}
