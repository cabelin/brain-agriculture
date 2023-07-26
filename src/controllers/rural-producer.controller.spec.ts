import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProducerController } from './rural-producer.controller';
import { RuralProducerService } from '../services/rural-producer.service';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { FarmEntity } from '../models/entities/farm.entity';
import { FarmDto } from '../models/dto/farm.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { FarmCreateDto } from '../models/dto/farm-create.dto';
import { PlantingCultureEntity } from '../models/entities/planting-culture.entity';

describe('RuralProducerController', () => {
  let controller: RuralProducerController;
  let ruralProducerService: RuralProducerService;

  function buildFarmCreateDto(farm: Partial<FarmCreateDto> = {}): FarmCreateDto {
    return {
      name: "Farm001",
      city: "BH",
      state: "MG",
      totalArea: 1000,
      vegetationArea: 100,
      arableArea: 800,
      plantingCultureIds: [1, 2, 5],
      ...farm,
    };
  }

  function buildFarm(farm: Partial<FarmDto> = {}) {
    return {
      id: 4,
      name: "Farm001",
      city: "BH",
      state: "MG",
      totalArea: 1000,
      vegetationArea: 100,
      arableArea: 800,
      plantingCultures: [],
      ...farm,
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuralProducerController],
      providers: [
        RuralProducerService,
        {
          provide: getRepositoryToken(RuralProducerEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(FarmEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PlantingCultureEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<RuralProducerController>(RuralProducerController);
    ruralProducerService = module.get<RuralProducerService>(RuralProducerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(ruralProducerService).toBeDefined();
  });

  it('should be call service when request all rural producers', async () => {
    // Given
    const expected: RuralProducerDto[] = [{
      id: 1,
      name: 'Marcos',
      cpfOrCnpj: '29138327381',
      farm: null
    }];
    jest.spyOn(ruralProducerService, 'findAll').mockImplementation(() => Promise.resolve(expected));

    // When
    const results: RuralProducerDto[] = await controller.findAll();

    // Then
    expect(ruralProducerService.findAll).toBeCalled();
    expect(results).toBe(expected);
  });

  it('should be call service when request create a new rural producer', async () => {
    // Given
    const createDto: RuralProducerCreateDto = {
      name: 'Marcos',
      cpfOrCnpj: '292838291831',
      farm: null,
    };
    const expected: RuralProducerDto = {
      id: 1,
      ...createDto,
      farm: null,
    }
    jest.spyOn(ruralProducerService, 'create').mockImplementation(() => Promise.resolve(expected));

    // When
    const result: RuralProducerDto = await controller.create(createDto);

    // Then
    expect(ruralProducerService.create).toBeCalled();
    expect(result).toBe(expected);
    expect(result.id).not.toBeNull();
  });

  it('should be call service when request find a rural producer', async () => {
    // Given
    const id: string = "2";
    const expected: RuralProducerDto = {
      id: +id,
      name: 'test001',
      cpfOrCnpj: '29382139322',
      farm: null,
    };
    jest.spyOn(ruralProducerService, 'findOne').mockImplementation(() => Promise.resolve(expected));

    // When
    const result: RuralProducerDto = await controller.findOne(id);

    // Then
    expect(ruralProducerService.findOne).toBeCalled();
    expect(result).toBe(expected);
    expect(result.id).toBe(2)
  });

  it('should be call service when request update a rural producer', async () => {
    // Given
    const id: string = "3";
    const expected: RuralProducerDto = {
      id: +id,
      name: 'test001',
      cpfOrCnpj: '02938139231',
      farm: buildFarm(),
    };
    jest.spyOn(ruralProducerService, 'update').mockImplementation(() => Promise.resolve(expected));

    const ruralProducerUpdateDto: RuralProducerUpdateDto = {
      ...expected,
      farm: buildFarmCreateDto()
    };

    // When
    const result: RuralProducerDto = await controller.update(id, ruralProducerUpdateDto);

    // Then
    expect(ruralProducerService.update).toBeCalled();
    expect(result).toBe(expected);
    expect(result.id).toBe(3)
  });

  it('should be call service when request remove a rural producer', async () => {
    // Given
    const id: string = "3";
    jest.spyOn(ruralProducerService, 'remove').mockImplementation(() => Promise.resolve());

    // When
    await controller.remove(id);

    // Then
    expect(ruralProducerService.remove).toBeCalledWith(3);
  });

});
