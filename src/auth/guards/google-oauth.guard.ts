import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from 'config/config.service';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
