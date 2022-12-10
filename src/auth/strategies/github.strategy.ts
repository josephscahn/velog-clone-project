import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:8000/auth/github/callback',
      scope: ['public_profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: any) {
    const { username, displayName, photos, provider } = profile;
    const user = {
      name: displayName,
      login_id: username,
      profile_image: photos[0].value,
      provider: provider,
    };
    done(null, user);
  }
}
