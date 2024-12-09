import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateExerciseDto {
    @ApiProperty({ example: 'Bench' })
    @IsString()
    exerciseName: string;

    @ApiProperty({ example: 'FNEAOF'})
    @IsString()
    exerciseId: string;

    @ApiProperty({ example: 3 })
    @IsNumber()
    sets: number;

    @ApiProperty({ example: 4 })
    @IsNumber()
    reps: number;

    @ApiProperty({ example: 80 })
    @IsNumber()
    weight: number;

    @ApiProperty({ example: 'PTM3M' }) // ISO 8601 format
    @IsString()
    restTime: string;

    @IsNumber()
    planId: number;
}
