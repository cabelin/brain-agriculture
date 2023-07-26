import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { RuralProducerDto } from '../models/dto/rural-producer.dto';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { FarmCreateDto } from '../models/dto/farm-create.dto';
import { FarmEntity } from '../models/entities/farm.entity';
import { PlantingCultureEntity } from '../models/entities/planting-culture.entity';

@Injectable()
export class RuralProducerService {
    constructor(
        @InjectRepository(RuralProducerEntity)
        private ruralProducerRepository: Repository<RuralProducerEntity>,
        @InjectRepository(FarmEntity)
        private farmRepository: Repository<FarmEntity>,
        @InjectRepository(PlantingCultureEntity)
        private plantingCultureRepository: Repository<PlantingCultureEntity>,
    ) {}
    
    async create(ruralProducerCreateDto: RuralProducerCreateDto): Promise<RuralProducerDto> {
        await this.validateRuralProducer(ruralProducerCreateDto);

        const farmEntity = await this.createFarm(ruralProducerCreateDto.farm);

        const ruralProducerSavedEntity = await this.createRuralProducer(ruralProducerCreateDto, farmEntity);

        const ruralProducerDto: RuralProducerDto = {
            id: ruralProducerSavedEntity.id,
            name: ruralProducerSavedEntity.name,
            cpfOrCnpj: ruralProducerSavedEntity.cpfOrCnpj,
            farm: ruralProducerSavedEntity.farm,
        };
        return ruralProducerDto;
    }

    private async createRuralProducer(ruralProducerCreateDto: RuralProducerCreateDto, farmEntity: FarmEntity) {
        const ruralProducerEntity = this.ruralProducerRepository.create(ruralProducerCreateDto);
        ruralProducerEntity.farm = farmEntity;
        return this.ruralProducerRepository.save(ruralProducerEntity);
    }

    private async createFarm(farm: FarmCreateDto) {
        const farmEntity = this.farmRepository.create(farm);
        farmEntity.plantingCultures = await this.plantingCultureRepository.find({
            where: { id: In(farm.plantingCultureIds) }
        });
        return this.farmRepository.save(farmEntity);
    }

    async findAll(): Promise<RuralProducerDto[]> {
        return this.ruralProducerRepository.find({
            relations: {
                farm: {
                    plantingCultures: true,
                },
            }
        });
    }

    async findOne(id: number): Promise<RuralProducerDto> {
        const ruralProducerEntity = (await this.ruralProducerRepository.find({
            where: { id },
            relations: {
                farm: {
                    plantingCultures: true,
                },
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
            const { name, city, state, totalArea, arableArea, vegetationArea, plantingCultureIds } = ruralProducerUpdateDto.farm;
            farmToUpdate.name = name;
            farmToUpdate.city = city;
            farmToUpdate.state = state;
            farmToUpdate.totalArea = totalArea;
            farmToUpdate.arableArea = arableArea;
            farmToUpdate.vegetationArea = vegetationArea;
            farmToUpdate.plantingCultures = await this.plantingCultureRepository.find({
                where: { id: In(plantingCultureIds) }
            });;

            await this.farmRepository.save(farmToUpdate);            
        }

        const { name, cpfOrCnpj } = ruralProducerUpdateDto;
        await this.ruralProducerRepository.update({ id }, { name, cpfOrCnpj });

        return this.ruralProducerRepository.findOne({
            where: { id },
            relations: {
                farm: {
                    plantingCultures: true
                },
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
            
            ruralProducer.farm.plantingCultures = [];
            await this.farmRepository.save(ruralProducer.farm);

            await this.farmRepository.remove(ruralProducer.farm);
        }
    }

    async validateRuralProducer(ruralProducerDto: RuralProducerCreateDto | RuralProducerUpdateDto, id?: number) {
        await this.validateExistsByCpfCnpj(ruralProducerDto.cpfOrCnpj, id);
        await this.validateFarm(ruralProducerDto.farm);
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

    async validateFarm(farm: FarmCreateDto) {
        if (!farm) return;

        await this.validateFarmAreas(farm);

        await this.validatePlantingCultures(farm.plantingCultureIds);
    }

    async validateFarmAreas(farm: FarmCreateDto) {
        const { arableArea, vegetationArea, totalArea } = farm;
        if (arableArea + vegetationArea > totalArea) {
            throw new BadRequestException('Total area must be greater than (Arable area + Vegetation area)')
        }
    }

    async validatePlantingCultures(plantingCultureIds: number[] = []) {
        const qnt = await this.plantingCultureRepository.count({
            where: {
                id: In(plantingCultureIds)
            }
        });
        if (plantingCultureIds.length > 0 && qnt !== plantingCultureIds.length) {
            throw new BadRequestException('One or more planting culture do not exists')
        }
    }
    
}
