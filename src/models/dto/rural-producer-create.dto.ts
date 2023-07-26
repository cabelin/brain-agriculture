import { IsNotEmpty, IsNotEmptyObject, Matches, Validate, ValidateNested } from 'class-validator';
import { IsCpfCnpj } from '../../validators/cpfCnpj.validator';
import { FarmCreateDto } from './farm-create.dto';
import { Type } from 'class-transformer';

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
