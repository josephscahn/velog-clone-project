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
import { HttpModule } from '@nestjs/axios';
import { UploadService } from 'src/upload/upload.service';

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
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, UploadService],
  exports: [AuthService],
})
export class AuthModule {}
