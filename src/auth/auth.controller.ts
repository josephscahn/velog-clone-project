import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Get,
  HttpStatus,
  Response,
  Res,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { CreateSocialUserDto } from 'src/dto/user/create-social-user.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from './guards/facbook-oauth.guard';
import { GithubAuthGuard } from './guards/github-oauth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.authService.checkEmail(email);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    } else {
      const code = await this.authService.sendEmail(email);
      return { message: 'Send Email', signup_code: code };
    }
  }

  @Post('login_id')
  async checkLoginId(@Body('login_id') login_id: string) {
    const user = await this.authService.checkLoginId(login_id);

    if (user) {
      throw new ConflictException('이미 가입된 로그인 아이디입니다.');
    } else {
      return { message: '사용 가능한 로그인 아이디입니다' };
    }
  }

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(201)
  async signupWithEmail(@Query('type') type: string, @Body() createUserDto: CreateUserDto) {
    try {
      let result: object = {};
      switch (type) {
        case 'email':
          result = await this.authService.signupWithEmail(createUserDto);
          break;
        case 'github':
          const createGithubUserDto: CreateSocialUserDto = {
            name: createUserDto.name,
            login_id: createUserDto.login_id,
            about_me: createUserDto.about_me,
            profile_image: createUserDto.profile_image,
            provider: type,
          };
          result = await this.authService.signupWithSocial(createGithubUserDto);
          break;
        case 'google':
          const createGoogleUserDto: CreateSocialUserDto = {
            name: createUserDto.name,
            login_id: createUserDto.login_id,
            email: createUserDto.email,
            about_me: createUserDto.about_me,
            profile_image: createUserDto.profile_image,
            provider: type,
          };
          result = await this.authService.signupWithSocial(createGoogleUserDto);
          break;
        case 'facebook':
          const createFacebookUserDto: CreateSocialUserDto = {
            name: createUserDto.name,
            login_id: createUserDto.login_id,
            about_me: createUserDto.about_me,
            profile_image: createUserDto.profile_image,
            provider: type,
          };
          result = await this.authService.signupWithSocial(createFacebookUserDto);
          break;
        default:
          throw new BadRequestException(
            'Type must to be `email` or `github` or `google` or `facebook`',
          );
      }
      console.log(result);
      // const {token, id, profile_image, ...} = result;
      return {
        message: 'signup & login success',
        token: result['token'],
        id: result['id'],
        profile_image: result['profile_image'],
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이메일 또는 로그인 아이디가 중복 되었습니다');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(201)
  async login(@GetUser() user: User) {
    const data = await this.authService.login(user);
    return {
      message: 'login success',
      token: data.token,
      id: data.id,
      profile_image: data.profile_image,
    };
  }

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Request() req) {
    const data = await this.authService.githubLogin(req.user);
    return data;
  }

  @Get('/github')
  @UseGuards(GithubAuthGuard)
  async githubAuth(@Request() req) {
    return HttpStatus.OK;
  }

  @Get('/google')
  // @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    return {
      redirect_url: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5173/auth/google/callback&scope=email profile&response_type=code`,
    };
  }

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    const data = this.authService.googleLogin(req.user);
    return data;
  }

  @Get('/facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthRedirect(@Request() req) {
    const data = await this.authService.facebookLogin(req.user);
    return data;
  }

  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookAuth(@Request() req) {
    return HttpStatus.OK;
  }
}
