import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class LoginDto extends PickType(CreateUserDto, [
  'login_id',
  'password',
] as const) {}
