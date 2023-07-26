import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmEntity } from '../models/entities/farm.entity';
import { ReportController } from '../controllers/report.controller';
import { ReportService } from '../services/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([FarmEntity])],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
