import { FarmDto } from "./farm.dto";

export class RuralProducerDto {

    id: number;

    name: string;

    cpfOrCnpj: string;

    farm: FarmDto;

}
