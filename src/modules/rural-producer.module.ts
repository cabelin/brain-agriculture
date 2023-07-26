import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuralProducerController } from '../controllers/rural-producer.controller';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { RuralProducerService } from '../services/rural-producer.service';
import { FarmEntity } from '../models/entities/farm.entity';
import { PlantingCultureEntity } from '../models/entities/planting-culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RuralProducerEntity, FarmEntity, PlantingCultureEntity])],
  controllers: [RuralProducerController],
  providers: [RuralProducerService]
})
export class RuralProducerModule {}
