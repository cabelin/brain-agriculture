import { PlantingCultureDto } from "./planting-culture.dto";

export class FarmDto {

    id: number;

    name: string;

    city: string;

    state: string;

    totalArea: number;

    arableArea: number;

    vegetationArea: number;

    plantingCultures: PlantingCultureDto[];

}
