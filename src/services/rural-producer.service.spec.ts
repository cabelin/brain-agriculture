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
import { FarmCreateDto } from '../models/dto/farm-create.dto';
import { PlantingCultureEntity } from '../models/entities/planting-culture.entity';

describe('RuralProducerService', () => {
  let service: RuralProducerService;
  let ruralProducerRepository: Repository<RuralProducerEntity>;
  let farmRepository: Repository<FarmEntity>;
  let plantingCultureRepository: Repository<PlantingCultureEntity>;
  
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
      plantingCultures: [{
        id: 1,
        name: 'Sója',
      }, {
        id: 2,
        name: 'Milho',
      }, {
        id: 5,
        name: 'Algodão',
      }],
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
        {
          provide: getRepositoryToken(PlantingCultureEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RuralProducerService>(RuralProducerService);
    ruralProducerRepository = module.get<Repository<RuralProducerEntity>>(getRepositoryToken(RuralProducerEntity));
    farmRepository = module.get<Repository<FarmEntity>>(getRepositoryToken(FarmEntity));
    plantingCultureRepository = module.get<Repository<PlantingCultureEntity>>(getRepositoryToken(PlantingCultureEntity));

    jest.spyOn(ruralProducerRepository, 'count').mockImplementation(() => Promise.resolve(0));
    jest.spyOn(plantingCultureRepository, 'count').mockImplementation(() => Promise.resolve(3));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ruralProducerRepository).toBeDefined();
    expect(farmRepository).toBeDefined();
    expect(plantingCultureRepository).toBeDefined();
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
      farm: buildFarmCreateDto()
    };

    const ruralProducerEntity: RuralProducerEntity = {
      ...expected,
      farm: {
        ...expected.farm
      },
    };

    jest.spyOn(farmRepository, 'create').mockImplementation(() => ruralProducerEntity.farm);
    jest.spyOn(farmRepository, 'save').mockImplementation(() => Promise.resolve({
      ...expected.farm,
    }));
    jest.spyOn(ruralProducerRepository, 'create').mockImplementation(() => ruralProducerEntity);
    jest.spyOn(plantingCultureRepository, 'find').mockImplementation(() => Promise.resolve(expected.farm.plantingCultures));
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
      farm: buildFarmCreateDto({
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
      farm: buildFarmCreateDto({
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

  it('should be call repository when create service and throw invalid planting culture', async () => {
    // Given
    const ruralProducerCreateDto: RuralProducerCreateDto = {
      name: "José",
      cpfOrCnpj: "92837276372",
      farm: buildFarmCreateDto({
        totalArea: 950,
        vegetationArea: 100,
        arableArea: 800,
        plantingCultureIds: [1, 2, 5]
      })
    };
    jest.spyOn(plantingCultureRepository, 'count').mockImplementation(() => Promise.resolve(2));

    try {
      // When
      await service.create(ruralProducerCreateDto);
    } catch (error) {
      // Then
      expect(error.status).toBe(400);
      expect(error.response).toStrictEqual({
        error: "Bad Request",
        message: "One or more planting culture do not exists",
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
        farm: {
          plantingCultures: true,
        }
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
      expect(ruralProducerRepository.find).toBeCalledWith({ where: { id }, relations: { farm: { plantingCultures: true } } });
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
    const id = 4;

    const ruralProducerUpdateDto: RuralProducerUpdateDto = {
      name: 'newName',
      cpfOrCnpj: '39283728372',
      farm: buildFarmCreateDto({
        totalArea: 5000
      }),
    };

    const farm = buildFarm();
    const ruralProducerEntityExisting: RuralProducerEntity = {
      id,
      name: 'test001',
      cpfOrCnpj: '39282829921',
      farm,
    }

    jest.spyOn(ruralProducerRepository, 'findOne').mockReturnValueOnce(Promise.resolve(ruralProducerEntityExisting));
    jest.spyOn(plantingCultureRepository, 'find').mockReturnValue(Promise.resolve(ruralProducerEntityExisting.farm.plantingCultures));
    jest.spyOn(farmRepository, 'save').mockImplementation();

    jest.spyOn(ruralProducerRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);

    const expectedEntity: RuralProducerEntity = {
      ...ruralProducerEntityExisting,
      ...ruralProducerUpdateDto,
      farm: {
        id: ruralProducerEntityExisting.id,
        name: ruralProducerUpdateDto.farm.name,
        city: ruralProducerUpdateDto.farm.city,
        state: ruralProducerUpdateDto.farm.state,
        totalArea: ruralProducerUpdateDto.farm.totalArea,
        arableArea: ruralProducerUpdateDto.farm.arableArea,
        vegetationArea: ruralProducerUpdateDto.farm.vegetationArea,
        plantingCultures: ruralProducerEntityExisting.farm.plantingCultures,
      },
    };
    jest.spyOn(ruralProducerRepository, 'findOne').mockReturnValueOnce(Promise.resolve(expectedEntity));

    // When
    const result: RuralProducerDto = await service.update(id, ruralProducerUpdateDto);

    // Then
    expect(farmRepository.save).toHaveBeenCalledWith(expectedEntity.farm);

    const { name, cpfOrCnpj } = ruralProducerUpdateDto;
    expect(ruralProducerRepository.update).toHaveBeenCalledWith({ id }, { name, cpfOrCnpj });

    expect(ruralProducerRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: {
        farm: {
          plantingCultures: true
        },
      }
    });

    expect(result).toStrictEqual(expectedEntity);
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
    jest.spyOn(farmRepository, 'save').mockImplementation();
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
    expect(farmRepository.remove).toBeCalledWith({
      ...expected.farm,
      plantingCultures: [],
    });
    expect(farmRepository.remove).toBeCalledWith(expected.farm);
  });

});
