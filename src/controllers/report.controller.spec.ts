import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FarmEntity } from '../models/entities/farm.entity';
import { ReportController } from './report.controller';
import { ReportService } from '../services/report.service';

describe('ReportController', () => {
  let controller: ReportController;
  let reportService: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(FarmEntity),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useFactory: jest.fn(),
        }
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    reportService = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(reportService).toBeDefined();
  });

});
