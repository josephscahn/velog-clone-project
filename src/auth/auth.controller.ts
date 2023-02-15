import { HttpService } from '@nestjs/axios';
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
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { CreateSocialUserDto } from 'src/dto/user/create-social-user.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { User } from 'src/entity/user.entity';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from './guards/facbook-oauth.guard';
import { GithubAuthGuard } from './guards/github-oauth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly http: HttpService) {}

  @Post('/email')
  async checkEmail(@Body('email') email: string) {
    const user = await this.authService.checkEmail(email);

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    } else {
      const code = await this.authService.sendEmail(email);
      const response = SetResponse('', ResponseMessage.AVAILABLE_EMAIL);
      return { statusCode: response[0], message: response[1], code: code };
    }
  }

  @Post('login_id')
  async checkLoginId(@Body('login_id') login_id: string) {
    const user = await this.authService.checkLoginId(login_id);

    if (user) {
      throw new ConflictException('이미 가입된 로그인 아이디입니다.');
    } else {
      const response = SetResponse('', ResponseMessage.AVAILABLE_ID);
      return { statusCode: response[0], message: response[1] };
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
          result = await this.authService.signupWithEmail(createUserDto, type);
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
          throw new BadRequestException('Type 형식을 지켜주세요.');
      }
      const response = SetResponse(type, ResponseMessage.SIGNUP_SUCCESS);
      return {
        statusCode: response[0],
        message: response[1],
        token: result['token'],
        id: result['id'],
        profile_image: result['profile_image'],
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('이메일 또는 로그인 아이디가 중복 되었습니다');
      } else if (err.message === ResponseMessage.BAD_REQUEST) {
        throw new BadRequestException(ResponseMessage.BAD_REQUEST);
      } else {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(201)
  async login(@GetUser() user: User) {
    const data = await this.authService.login(user);
    const response = SetResponse(data.id + '번 유저', ResponseMessage.LOGIN_SUCCESS);
    return {
      statusCode: response[0],
      message: response[1],
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

  @Get('/google/callback')
  async googleAuthRedirect(@Query() query, @Request() req) {
    const code = query.code;

    const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=${process.env.GOOGLE_GRANT_TYPE}`;

    const access_token = await this.http.axiosRef
      .post(url, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .then(el => {
        return el.data.access_token;
      })
      .catch(err => {
        console.log(err);
        throw new HttpException('google oauth access_token err', 500);
      });

    const google_api_url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;

    const user_info = await this.http.axiosRef
      .get(google_api_url, {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
      .then(el => {
        return el.data;
      })
      .catch(err => {
        console.log(err);
        throw new HttpException('구글 로그인 서버 오류입니다.', 500);
      });

    const data = await this.authService.googleLogin(user_info);
    let response: (string | HttpStatus)[];
    switch (data.message) {
      case '구글 로그인에 성공했습니다.':
        response = SetResponse('', ResponseMessage.LOGIN_SUCCESS);
        return { statusCode: response[0], message: response[1], token: data.token };
      case '회원가입 먼저 진행해야합니다':
        response = SetResponse('', ResponseMessage.SIGNUP_NEEDED);
        return { statusCode: response[0], message: response[1], user: data.user };
      case '구글에 등록되지않은 유저입니다.':
        throw new ForbiddenException(data.message);
    }
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
