import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { FarmEntity } from '../models/entities/farm.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(FarmEntity)
        private farmRepository: Repository<FarmEntity>,
        private dataSource: DataSource,
    ) {}
    
    async dashboard() {
        const farmTotalCount = await this.farmRepository.count();
        const byState = await this.dataSource
            .getRepository(FarmEntity)
            .createQueryBuilder('f')
            .select(['f.state as name', 'COUNT(f.id) as count', 'SUM(f.totalArea) as area'])
            .groupBy('f.state')
            .getRawMany()
        const byPlantingCulture = await this.dataSource
            .getRepository(FarmEntity)
            .createQueryBuilder('f')
            .select(['pc.name as name', 'COUNT(f.id) as count'])
            .leftJoin('f.plantingCultures', 'pc')
            .groupBy('pc.name')
            .getRawMany()
        const byAreas = await this.dataSource
            .getRepository(FarmEntity)
            .createQueryBuilder('f')
            .select(['SUM(f.totalArea) as totalArea', 'SUM(f.arableArea) as arableArea', 'SUM(f.vegetationArea) as vegetationArea'])
            .getRawOne();
        const farmTotalArea = +(byAreas.totalarea);
        
        return {
            totalFarms: farmTotalCount,
            totalFarmArea: farmTotalArea,
            charts: {
                byState: this.buildChartByState(byState, farmTotalCount),
                byPlantingCulture: this.buildChartByPlantingCulture(byPlantingCulture),
                byAreas: this.buildChartByAreas(byAreas),
            }
        };
    }

    buildChartByState(byState, farmTotalCount: number) {
        return [
            ...byState.map(state => ({
                name: state.name,
                count: +state.count,
                area: +state.area,
                percent: (state.count * 100 / farmTotalCount),
            })),
        ];
    }

    buildChartByPlantingCulture(byPlantingCulture) {
        const totalPlatingCount = byPlantingCulture
            .map(plantingCulture => +plantingCulture.count)
            .reduce((sum: number, current: number) => sum + current, 0);

        return [
            ...byPlantingCulture.map(plantingCulture => ({
                ...plantingCulture,
                count: +plantingCulture.count,
                percent: (plantingCulture.count * 100 / totalPlatingCount)
            }))
        ];
    }

    buildChartByAreas(byAreas) {
        const noneArea = byAreas.totalarea - byAreas.vegetationarea - byAreas.arablearea;
        return [{
            name: 'vetationArea',
            area: +byAreas.vegetationarea,
            percent: (byAreas.vegetationarea * 100 / byAreas.totalarea),
        }, {
            name: 'arableArea',
            area: +byAreas.arablearea,
            percent: (byAreas.arablearea * 100 / byAreas.totalarea),
        }, {
            name: 'noneArea',
            area: +noneArea,
            percent: (noneArea * 100 / byAreas.totalarea),
        }];
    }
    
}
