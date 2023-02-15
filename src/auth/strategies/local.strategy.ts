import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login_id' });
  }

  async validate(login_id: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(login_id, password);
    if (!user) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }
    return user;
  }
}
