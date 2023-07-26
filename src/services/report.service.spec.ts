import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { FarmEntity } from '../models/entities/farm.entity';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let farmRepository: Repository<FarmEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ReportService>(ReportService);
    farmRepository = module.get<Repository<FarmEntity>>(getRepositoryToken(FarmEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(farmRepository).toBeDefined();
  });

});
