import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
