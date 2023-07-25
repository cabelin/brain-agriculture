import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProducerController } from './rural-producer.controller';
import { RuralProducerService } from '../services/rural-producer.service';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';

describe('RuralProducerController', () => {
  let controller: RuralProducerController;
  let ruralProducerService: RuralProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RuralProducerController],
      providers: [
        RuralProducerService,
        {
          provide: getRepositoryToken(RuralProducerEntity),
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
    const expected = [new RuralProducerDto()];
    jest.spyOn(ruralProducerService, 'findAll').mockImplementation(() => Promise.resolve(expected));

    // When
    const results: RuralProducerDto[] = await controller.findAll();

    // Then
    expect(ruralProducerService.findAll).toBeCalled();
    expect(results).toBe(expected);
  });

  it('should be call service when request create a new rural producer', async () => {
    // Given
    const expected = new RuralProducerDto();
    jest.spyOn(ruralProducerService, 'create').mockImplementation(() => Promise.resolve(expected));

    // When
    const result: RuralProducerDto = await controller.create(expected);

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
    };
    jest.spyOn(ruralProducerService, 'update').mockImplementation(() => Promise.resolve(expected));

    // When
    const result: RuralProducerDto = await controller.update(id, expected);

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
