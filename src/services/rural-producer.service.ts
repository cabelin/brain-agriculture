import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { FarmCreateDto } from '../models/dto/farm-create.dto';
import { FarmEntity } from '../models/entities/farm.entity';

@Injectable()
export class RuralProducerService {
    constructor(
        @InjectRepository(RuralProducerEntity)
        private ruralProducerRepository: Repository<RuralProducerEntity>,
        @InjectRepository(FarmEntity)
        private farmRepository: Repository<FarmEntity>,
    ) {}
    
    async create(ruralProducerCreateDto: RuralProducerCreateDto): Promise<RuralProducerDto> {
        await this.validateRuralProducer(ruralProducerCreateDto);

        const farmSaved = await this.farmRepository.save(ruralProducerCreateDto.farm);
        ruralProducerCreateDto.farm = farmSaved;

        const ruralProducerEntity = this.ruralProducerRepository.create(ruralProducerCreateDto);

        const ruralProducerSavedEntity = await this.ruralProducerRepository.save(ruralProducerEntity);
        const ruralProducerDto: RuralProducerDto = {
            id: ruralProducerSavedEntity.id,
            name: ruralProducerSavedEntity.name,
            cpfOrCnpj: ruralProducerSavedEntity.cpfOrCnpj,
            farm: ruralProducerSavedEntity.farm,
        };
        return ruralProducerDto;
    }

    async findAll(): Promise<RuralProducerDto[]> {
        return this.ruralProducerRepository.find({
            relations: {
                farm: true,
            }
        });
    }

    async findOne(id: number): Promise<RuralProducerDto> {
        const ruralProducerEntity = (await this.ruralProducerRepository.find({
            where: { id },
            relations: {
                farm: true
            }
        }))?.[0];
        if (!ruralProducerEntity) {
            throw new NotFoundException(`Not exists rural producer with id: ${id}`);
        }
        
        const ruralProducerDto: RuralProducerDto = {
            ...ruralProducerEntity,
        };
        return ruralProducerDto;
    }

    async update(id: number, ruralProducerUpdateDto: RuralProducerUpdateDto): Promise<RuralProducerDto> {
        await this.validateRuralProducer(ruralProducerUpdateDto, id);
        
        const ruralProducerToUpdate = await this.ruralProducerRepository.findOne({
            where: { id },
            relations: {
                farm: true,
            }
        });

        const farmToUpdate = ruralProducerToUpdate.farm;
        const hasFarmToUpdate = !!ruralProducerUpdateDto.farm;
        if (hasFarmToUpdate) {
            const { name, city, state, totalArea, arableArea, vegetationArea } = ruralProducerUpdateDto.farm;
            await this.farmRepository.update({
                id: farmToUpdate.id
            }, {
                name, city, state, totalArea, arableArea, vegetationArea
            });
        }

        const { name, cpfOrCnpj } = ruralProducerUpdateDto;
        await this.ruralProducerRepository.update({ id }, { name, cpfOrCnpj });
        return this.ruralProducerRepository.findOne({
            where: { id },
            relations: {
                farm: true,
            }
        });
    }

    async remove(id: number) {
        const ruralProducer = await this.ruralProducerRepository.findOne({
            where: { id },
            relations: {
                farm: true,
            }
        });

        const exists = !!ruralProducer;
        if (exists) {
            await this.ruralProducerRepository.remove(ruralProducer);
            await this.farmRepository.remove(ruralProducer.farm);
        }
    }

    async validateRuralProducer(ruralProducerDto: RuralProducerCreateDto | RuralProducerUpdateDto, id?: number) {
        await this.validateExistsByCpfCnpj(ruralProducerDto.cpfOrCnpj, id);
        this.validateFarm(ruralProducerDto.farm);
    }

    async validateExistsByCpfCnpj(cpfOrCnpj: string, id?: number) {
        const countByCpfCnpj = await this.ruralProducerRepository.count(
            {
                where: { cpfOrCnpj, id: id ? Not(id) : undefined }
            });
        if (countByCpfCnpj > 0) {
            throw new BadRequestException(`Already exists rural producer with cpf/cnpj: ${cpfOrCnpj}`);
        }
    }

    validateFarm(farm: FarmCreateDto) {
        if (!farm) return;

        const { arableArea, vegetationArea, totalArea } = farm;
        if (arableArea + vegetationArea > totalArea) {
            throw new BadRequestException('Total area must be greater than (Arable area + Vegetation area)')
        }
    }
    
}
