import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AboutModule } from './about/about.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';

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
    AboutModule,
    HealthModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
