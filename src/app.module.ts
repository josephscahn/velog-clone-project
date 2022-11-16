import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, BoardModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
