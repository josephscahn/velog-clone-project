import { Allow, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(0, 20)
  name: string;

  @IsNotEmpty()
  @Length(8, 16)
  password: string;

  @IsNotEmpty()
  @Length(0, 15)
  login_id: string;

  @Allow()
  about_me?: string;
}
