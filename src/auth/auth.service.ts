import { ForbiddenException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UserRepository } from 'src/repository/user.repository';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './context/types';
import { CreateSocialUserDto } from 'src/dto/user/create-social-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async sendEmail(email: string) {
    const code: string = Math.round(Math.random() * 10000).toString();
    this.mailerService
      .sendMail({
        to: email, // List of receivers email address
        from: 'velog-clone-project@naver.com', // Senders email address
        subject: 'Velog-clone-project signup code ✔', // Subject line
        text: `signup code is : ${code}`, // plaintext body
        html: `signup code is : <b>${code}</b>`, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
    return code;
  }

  async checkEmail(email: string) {
    return await this.userRepository.checkEmail(email);
  }

  async signupWithEmail(createUserDto: CreateUserDto) {
    const password: string = createUserDto.password;
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const user = await this.userRepository.signupWithEmail(
      createUserDto,
      hashedPassword,
    );
    return await this.login(user);
  }

  async signupWithSocial(createSocialUserDto: CreateSocialUserDto) {
    const user = await this.userRepository.signupWithSocial(
      createSocialUserDto,
    );
    return await this.login(user);
  }

  async validateUser(login_id: string, password: string) {
    const user = await this.userRepository.checkLoginId(login_id);

    if (!user) {
      throw new ForbiddenException('로그인 아이디를 확인 해주세요');
    }

    if (bcryptjs.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: IPayload = {
      sub: user.id,
      login_id: user.login_id,
      name: user.name,
    };
    return this.jwtService.sign({ user: payload });
  }

  async googleLogin(user: object) {
    if (!user) {
      return new ForbiddenException(403, 'No user from google');
    }
    const data = await this.userRepository.checkEmail(user['email']);
    if (!data) {
      return {
        message: '회원가입 먼저 진행해야합니다',
        user: user,
      };
    }

    const token = await this.login(data);
    return {
      message: 'Google login success',
      token: token,
    };
  }

  async githubLogin(user: object) {
    if (!user) {
      return new ForbiddenException(403, 'No user from github');
    }
    // console.log(user['email']);
    const data = await this.userRepository.checkLoginId(user['login_id']);
    if (!data) {
      return {
        message: '회원가입 먼저 진행해야합니다',
        user: user,
      };
    }

    const token = await this.login(data);
    return {
      message: 'Github login success',
      token: token,
    };
  }

  async facebookLogin(user: object) {
    if (!user) {
      return new ForbiddenException(403, 'No user from facebook');
    }
    const data = await this.userRepository.checkEmail(user['email']);
    if (!data) {
      return {
        message: '회원가입 먼저 진행해야합니다',
        user: user,
      };
    }

    const token = await this.login(data);
    return {
      message: 'Facebook login success',
      token: token,
    };
  }
}
