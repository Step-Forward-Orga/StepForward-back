import { IsNumber, IsString } from "class-validator";

export class SetsDto {
    @IsNumber()
    reps: number;

    @IsNumber()
    weight: number;

    @IsNumber()
    order: number;

    @IsString()
    type: 'PLANNED' | 'COMPLETED';
}