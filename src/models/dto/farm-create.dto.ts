import { ArrayNotEmpty, IsNotEmpty, IsPositive } from "class-validator";

export class FarmCreateDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    state: string;

    @IsPositive()
    totalArea: number;

    @IsPositive()
    arableArea: number;

    @IsPositive()
    vegetationArea: number;

    @ArrayNotEmpty()
    plantingCultureIds: number[];

}
