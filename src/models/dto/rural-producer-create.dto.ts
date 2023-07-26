import { IsNotEmpty, IsNotEmptyObject, Validate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCpfCnpj } from '../../validators/cpfCnpj.validator';
import { FarmCreateDto } from './farm-create.dto';

export class RuralProducerCreateDto {

    @IsNotEmpty()
    name: string;

    @Validate(IsCpfCnpj)
    cpfOrCnpj: string;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => FarmCreateDto)
    farm: FarmCreateDto;

}
