import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from 'config/config.service';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  constructor(private configService: ConfigService) {
    super({
      accessType: 'offline',
    });
  }
}
