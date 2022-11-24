import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(0, 20)
  name: string;

  @IsOptional()
  @Length(8, 16)
  password: string;

  @IsNotEmpty()
  @Length(0, 15)
  login_id: string;

  @Allow()
  about_me?: string;

  @Allow()
  profile_image?: string;
}
