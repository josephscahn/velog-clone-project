import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.GMAIL_LOGIN_ID, // generated ethereal user
          pass: process.env.GMAIL_PASSWORD, // generated ethereal password
        },
      },
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
