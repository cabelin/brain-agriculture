import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RuralProducerService } from './rural-producer.service';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { NotFoundException } from '@nestjs/common';

describe('RuralProducerService', () => {
  let service: RuralProducerService;
  let ruralProducerRepository: Repository<RuralProducerEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RuralProducerService,
        {
          provide: getRepositoryToken(RuralProducerEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RuralProducerService>(RuralProducerService);
    ruralProducerRepository = module.get<Repository<RuralProducerEntity>>(getRepositoryToken(RuralProducerEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(ruralProducerRepository).toBeDefined();
  });

  it('should be call repository when create service', async () => {
    // Given
    const id = 3;
    const expected: RuralProducerDto = {
      id,
      name: 'test001',
      cpfOrCnpj: '39282829921',
    };

    const ruralProducerCreateDto: RuralProducerCreateDto = {
      name: expected.name,
      cpfOrCnpj: expected.cpfOrCnpj,
    };

    const ruralProducerEntity: RuralProducerEntity = {
      ...expected,
    };
    jest.spyOn(ruralProducerRepository, 'create').mockImplementation(() => ruralProducerEntity);
    jest.spyOn(ruralProducerRepository, 'save').mockImplementation(() => Promise.resolve(ruralProducerEntity));

    // When
    const result: RuralProducerDto = await service.create(ruralProducerCreateDto);

    // Then
    expect(ruralProducerRepository.create).toBeCalled();
    expect(ruralProducerRepository.save).toBeCalledWith(ruralProducerEntity);
    expect(result).toStrictEqual(expected);
  });

  it('should be call repository when find all service', async () => {
    // Given
    const expected: RuralProducerEntity[] = [{
      id: 1,
      name: 'test001',
      cpfOrCnpj: '93829282738'
    }, {
      id: 2,
      name: 'test002',
      cpfOrCnpj: '92091728317'
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
      cpfOrCnpj: '93829282738'
    };
    jest.spyOn(ruralProducerRepository, 'findOneBy').mockImplementation(() => Promise.resolve(expected));

    // When
    const result: RuralProducerDto = await service.findOne(id);

    // Then
    expect(ruralProducerRepository.findOneBy).toBeCalledWith({ id });
    expect(result).toStrictEqual(expected);
  });

  it('should be not call repository when find one service throw not found', async () => {
    // Given
    const id = 3;
    const expected: RuralProducerEntity = {
      id,
      name: 'test001',
      cpfOrCnpj: '93829282738'
    };
    jest.spyOn(ruralProducerRepository, 'findOneBy').mockImplementation(() => Promise.resolve(null));

    // When

    try {
      await service.findOne(id);
    } catch (error) {
      // Then
      expect(ruralProducerRepository.findOneBy).toBeCalledWith({ id });
      expect(error.status).toBe(404);
      expect(error.response).toStrictEqual({
        message: "Not Found",
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
    };

    const ruralProducerUpdateDto: RuralProducerUpdateDto = {
      name: 'newName',
      cpfOrCnpj: '39283728372'
    };

    const ruralProducerEntityExisting: RuralProducerEntity = {
      ...expected,
    };
    jest.spyOn(ruralProducerRepository, 'update').mockResolvedValue({ affected: 1 } as UpdateResult);
    jest.spyOn(ruralProducerRepository, 'findOneBy').mockReturnValueOnce(Promise.resolve({
      ...ruralProducerEntityExisting,
      ...ruralProducerUpdateDto,
    }));

    // When
    const result: RuralProducerDto = await service.update(id, ruralProducerUpdateDto);

    // Then
    expect(ruralProducerRepository.update).toHaveBeenCalledWith({ id }, ruralProducerUpdateDto);
    expect(ruralProducerRepository.findOneBy).toHaveBeenCalledWith({ id });
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
      cpfOrCnpj: '93829282738'
    };
    jest.spyOn(ruralProducerRepository, 'findOneBy').mockImplementation(() => Promise.resolve(expected));
    jest.spyOn(ruralProducerRepository, 'remove').mockImplementation();

    // When
    await service.remove(id);

    // Then
    expect(ruralProducerRepository.findOneBy).toBeCalledWith({ id });
    expect(ruralProducerRepository.remove).toBeCalledWith(expected);
  });

});
