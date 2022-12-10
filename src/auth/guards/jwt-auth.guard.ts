import {
  BadRequestException,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const rawHeaders = request['rawHeaders'];
    const authIndex = rawHeaders.indexOf('Authorization');
    if (authIndex === -1) {
      throw new HttpException('Token 전송 안됨', HttpStatus.UNAUTHORIZED);
    }

    const token = rawHeaders[authIndex + 1].replace('Bearer ', '');
    request.user = this.validateToken(token);
    return true;
  }

  validateToken(token: string) {
    const secretKey = process.env.SECRET_KEY;

    try {
      let verify = jwt.verify(token, secretKey)['user'];
      verify = {
        id: verify['sub'],
        login_id: verify['login_id'],
        name: verify['name'],
      };
      return verify;
    } catch (e) {
      switch (e.message) {
        // 토큰에 대한 오류를 판단합니다.
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new BadRequestException('유효하지 않은 토큰입니다.');

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}
