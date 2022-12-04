import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/repository/post.repository';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
