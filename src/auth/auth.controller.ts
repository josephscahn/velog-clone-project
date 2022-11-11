import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.authService.checkEmail(email);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
    const code = await this.authService.sendEmail(email);
    return Object.assign({ message: 'Send Email', signup_code: code });
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  async signupWithEmail(
    @Query('type') type: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      switch (type) {
        case 'email':
          await this.authService.signupWithEmail(createUserDto);
          break;
        case 'github':
          return Object.assign({ message: 'github signup' });
        // break;
        case 'google':
          return Object.assign({ message: 'google signup' });
        // break;
        case 'facebook':
          return Object.assign({ message: 'facebook signup' });
        // break;
        default:
          throw new BadRequestException(
            'Type must to be `email` or `github` or `google` or `facebook`',
          );
      }
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이메일이 중복 되었습니다');
      }
      throw new InternalServerErrorException();
    }
  }
}
