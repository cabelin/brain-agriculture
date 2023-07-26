import { IsNotEmpty, Matches, Validate } from 'class-validator';
import { IsCpfCnpj } from '../../validators/cpfCnpj.validator';

export class RuralProducerCreateDto {

    @IsNotEmpty()
    name: string;


    @Validate(IsCpfCnpj)
    cpfOrCnpj: string;

}
