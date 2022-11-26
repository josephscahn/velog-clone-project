import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  imports: [PostModule],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
