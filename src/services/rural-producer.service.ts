import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';

@Injectable()
export class RuralProducerService {
    constructor(
        @InjectRepository(RuralProducerEntity)
        private ruralProducerRepository: Repository<RuralProducerEntity>,
    ) {}
    
    async create(ruralProducerCreateDto: RuralProducerCreateDto): Promise<RuralProducerDto> {
        const ruralProducerEntity = this.ruralProducerRepository.create(ruralProducerCreateDto);
        const ruralProducerSavedEntity = await this.ruralProducerRepository.save(ruralProducerEntity);
        const ruralProducerDto: RuralProducerDto = {
            id: ruralProducerSavedEntity.id,
            name: ruralProducerSavedEntity.name,
            cpfOrCnpj: ruralProducerSavedEntity.cpfOrCnpj,
        };
        return ruralProducerDto;
    }

    async findAll(): Promise<RuralProducerDto[]> {
        return this.ruralProducerRepository.find();
    }

    async findOne(id: number): Promise<RuralProducerDto> {
        const ruralProducerEntity = await this.ruralProducerRepository.findOneBy({ id });
        if (!ruralProducerEntity) {
            throw new NotFoundException();
        }
        const ruralProducerDto: RuralProducerDto = {
            ...ruralProducerEntity,
        };
        return ruralProducerDto;
    }

    async update(id: number, ruralProducerUpdateDto: RuralProducerUpdateDto): Promise<RuralProducerDto> {
        await this.ruralProducerRepository.update({ id }, ruralProducerUpdateDto);
        return this.ruralProducerRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const ruralProducer = await this.ruralProducerRepository.findOneBy({ id });
        const exists = !!ruralProducer;
        if (exists) {
            await this.ruralProducerRepository.remove(ruralProducer);
        }
    }
}
