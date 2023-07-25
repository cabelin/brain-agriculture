import { PartialType } from '@nestjs/mapped-types';
import { RuralProducerCreateDto } from './rural-producer-create.dto';

export class RuralProducerUpdateDto extends PartialType(RuralProducerCreateDto) {}
