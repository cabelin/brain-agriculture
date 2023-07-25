import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuralProducerController } from '../controllers/rural-producer.controller';
import { RuralProducerEntity } from '../models/entities/rural-producer.entity';
import { RuralProducerService } from '../services/rural-producer.service';

@Module({
  imports: [TypeOrmModule.forFeature([RuralProducerEntity])],
  controllers: [RuralProducerController],
  providers: [RuralProducerService]
})
export class RuralProducerModule {}
