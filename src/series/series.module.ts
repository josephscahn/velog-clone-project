import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostSeriesRepository } from 'src/repository/post-series.repository';
import { SeriesRepository } from 'src/repository/series.repository';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeriesRepository, PostSeriesRepository])],
  exports: [TypeOrmModule, SeriesService],
  providers: [SeriesService],
  controllers: [SeriesController],
})
export class SeriesModule {}
