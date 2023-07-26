import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RuralProducerService } from './rural-producer.service';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { FarmEntity } from '../models/entities/farm.entity';
import { FarmDto } from '../models/dto/farm.dto';

describe('RuralProducerService', () => {
  let service: RuralProducerService;
  let ruralProducerRepository: Repository<RuralProducerEntity>;
  let farmRepository: Repository<FarmEntity>;
  
  function buildFarm(farm: Partial<FarmDto> = {}) {
    return {
      id: 4,
      name: "Farm001",
      city: "BH",
      state: "MG",
      totalArea: 1000,
      vegetationArea: 100,
      arableArea: 800,
      platingCultures: [],
      ...farm,
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<RuralProducerService>(RuralProducerService);
    ruralProducerRepository = module.get<Repository<RuralProducerEntity>>(getRepositoryToken(RuralProducerEntity));
    farmRepository = module.get<Repository<FarmEntity>>(getRepositoryToken(FarmEntity));

    jest.spyOn(ruralProducerRepository, 'count').mockImplementation(() => Promise.resolve(0));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ruralProducerRepository).toBeDefined();
    expect(farmRepository).toBeDefined();
  });

  it('should be call repository when create service', async () => {
    // Given
    const id = 3;
    const expected: RuralProducerDto = {
      id,
      name: 'test001',
      cpfOrCnpj: '39282829921',
      farm: buildFarm(),
    };

    const ruralProducerCreateDto: RuralProducerCreateDto = {
      name: expected.name,
      cpfOrCnpj: expected.cpfOrCnpj,
      farm: {
        ...expected.farm,
      }
    };

    const ruralProducerEntity: RuralProducerEntity = {
      ...expected,
      farm: {
        ...expected.farm,
        platingCultures: [],
      },
    };

    jest.spyOn(farmRepository, 'save').mockImplementation(() => Promise.resolve({
      ...expected.farm,
      platingCultures: [],
    }));
    jest.spyOn(ruralProducerRepository, 'create').mockImplementation(() => ruralProducerEntity);
    jest.spyOn(ruralProducerRepository, 'save').mockImplementation(() => Promise.resolve(ruralProducerEntity));

    // When
    const result: RuralProducerDto = await service.create(ruralProducerCreateDto);

    // Then
    expect(ruralProducerRepository.create).toBeCalled();
    expect(ruralProducerRepository.save).toBeCalledWith(ruralProducerEntity);
    expect(result).toStrictEqual(expected);
  });

  it('should be call repository when create service and throw invalid area', async () => {
    // Given
    const id = 3;
    const ruralProducerCreateDto: RuralProducerCreateDto = {
      name: "José",
      cpfOrCnpj: "92837276372",
      farm: buildFarm({
        totalArea: 500,
        vegetationArea: 100,
        arableArea: 800
      })
    };

    try {
      // When
      await service.create(ruralProducerCreateDto);
    } catch (error) {
      // Then
      expect(error.status).toBe(400);
      expect(error.response).toStrictEqual({
        error: "Bad Request",
        message: "Total area must be greater than (Arable area + Vegetation area)",
        statusCode: 400
      });
    }
  });

  it('should be call repository when create service and throw already exists by cpf/cnpj', async () => {
    // Given
    const id = 3;
    const ruralProducerCreateDto: RuralProducerCreateDto = {
      name: "José",
      cpfOrCnpj: "92837276372",
      farm: buildFarm({
        totalArea: 950,
        vegetationArea: 100,
        arableArea: 800
      })
    };
    jest.spyOn(ruralProducerRepository, 'count').mockImplementation(() => Promise.resolve(1));

    try {
      // When
      await service.create(ruralProducerCreateDto);
    } catch (error) {
      // Then
      expect(error.status).toBe(400);
      expect(error.response).toStrictEqual({
        error: "Bad Request",
        message: "Already exists rural producer with cpf/cnpj: 92837276372",
        statusCode: 400
      });
    }
  });

  it('should be call repository when find all service', async () => {
    // Given
    const expected: RuralProducerEntity[] = [{
      id: 1,
      name: 'test001',
      cpfOrCnpj: '93829282738',
      farm: buildFarm()
    }, {
      id: 2,
      name: 'test002',
      cpfOrCnpj: '92091728317',
      farm: buildFarm()
    }];
    jest.spyOn(ruralProducerRepository, 'find').mockImplementation(() => Promise.resolve(expected));

    // When
    const results: RuralProducerDto[] = await service.findAll();

    // Then
    expect(ruralProducerRepository.find).toBeCalled();
    expect(results).toStrictEqual(expected);
  });

  it('should be call repository when find one service', async () => {
    // Given
    const id = 3;
    const expected: RuralProducerEntity = {
      id,
      name: 'test001',
      cpfOrCnpj: '93829282738',
      farm: buildFarm(),
    };
    jest.spyOn(ruralProducerRepository, 'find').mockImplementation(() => Promise.resolve([expected]));

    // When
    const result: RuralProducerDto = await service.findOne(id);

    // Then
    expect(ruralProducerRepository.find).toBeCalledWith({
      where: { id },
      relations: {
        farm: true
      }
    });
    expect(result).toStrictEqual(expected);
  });

  it('should be not call repository when find one service throw not found', async () => {
    // Given
    const id = 3;
    jest.spyOn(ruralProducerRepository, 'find').mockImplementation(() => Promise.resolve(null));

    try {
      // When
      await service.findOne(id);
    } catch (error) {
      // Then
      expect(ruralProducerRepository.find).toBeCalledWith({ where: { id }, relations: { farm: true } });
      expect(error.status).toBe(404);
      expect(error.response).toStrictEqual({
        error: "Not Found",
        message: "Not exists rural producer with id: 3",
        statusCode: 404
      });
    }
  });

  it('should be call repository when update service', async () => {
    // Given
    const id = 3;
    const expected: RuralProducerDto = {
      id,
      name: 'test001',
      cpfOrCnpj: '39282829921',
      farm: buildFarm({
        id: 10,
      }),
    };

    const ruralProducerUpdateDto: RuralProducerUpdateDto = {
      name: 'newName',
      cpfOrCnpj: '39283728372',
      farm: buildFarm({
        id: undefined,
        totalArea: 5000
      }),
    };

    const ruralProducerEntityExisting: RuralProducerEntity = {
      ...expected,
      farm: {
        ...expected.farm,
        platingCultures: [],
      }
    };
    jest.spyOn(ruralProducerRepository, 'findOne').mockReturnValueOnce(Promise.resolve({
      ...ruralProducerEntityExisting,
    }));
    jest.spyOn(ruralProducerRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
    jest.spyOn(ruralProducerRepository, 'findOne').mockReturnValueOnce(Promise.resolve({
      ...ruralProducerEntityExisting,
      ...ruralProducerUpdateDto,
      farm: {
        id: expected.id,
        ...ruralProducerUpdateDto.farm,
        platingCultures: [],
      }
    }));
    jest.spyOn(farmRepository, 'update').mockImplementation();

    // When
    const result: RuralProducerDto = await service.update(id, ruralProducerUpdateDto);

    // Then
    const { name: farmName, city, state, totalArea, arableArea, vegetationArea } = ruralProducerUpdateDto.farm;
    expect(farmRepository.update).toHaveBeenCalledWith({
      id: 10
    }, {
      name: farmName, city, state, totalArea, arableArea, vegetationArea,
    });

    const { name, cpfOrCnpj } = ruralProducerUpdateDto;
    expect(ruralProducerRepository.update).toHaveBeenCalledWith({ id }, { name, cpfOrCnpj });

    expect(ruralProducerRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: {
          farm: true,
      }
    });

    expect(result).toStrictEqual({
      ...ruralProducerEntityExisting,
      ...ruralProducerUpdateDto
    });
  });

  it('should be call repository when remove service', async () => {
    // Given
    const id = 4;
    const expected: RuralProducerEntity = {
      id,
      name: 'test001',
      cpfOrCnpj: '93829282738',
      farm: buildFarm(),
    };
    jest.spyOn(ruralProducerRepository, 'findOne').mockImplementation(() => Promise.resolve(expected));
    jest.spyOn(ruralProducerRepository, 'remove').mockImplementation();
    jest.spyOn(farmRepository, 'remove').mockImplementation();

    // When
    await service.remove(id);

    // Then
    expect(ruralProducerRepository.findOne).toBeCalledWith({
      where: { id },
      relations: {
          farm: true,
      },
    });
    expect(ruralProducerRepository.remove).toBeCalledWith(expected);
    expect(farmRepository.remove).toBeCalledWith(expected.farm);
  });

});
