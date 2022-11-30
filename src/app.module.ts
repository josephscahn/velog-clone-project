import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { CommentModule } from './comment/comment.module';
import { LologModule } from './lolog/lolog.module';
import { SeriesModule } from './series/series.module';
import { ListsModule } from './lists/lists.module';
import { MainModule } from './main/main.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
    CommentModule,
    LologModule,
    SeriesModule,
    ListsModule,
    MainModule,
    SearchModule,
    UploadModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
