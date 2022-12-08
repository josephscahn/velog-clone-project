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
import { GlobalExceptionFilter } from './exception/globalExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: 'public',
      serveRoot: '/public',
    }),
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  controllers: [],
})
export class AppModule {}
