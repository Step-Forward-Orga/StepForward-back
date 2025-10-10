import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

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
    aimed_reps: number;

    @ApiProperty({ example: 80 })
    @IsNumber()
    aimed_weight: number;

    @ApiProperty({ example: 'PTM3M' }) // ISO 8601 format
    @IsString()
    restTime: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    completed?: boolean;

    @ApiProperty({ example: 80 })
    @IsNumber()
    completed_weight?: number;

    @ApiProperty({ example: 4 })
    @IsNumber()
    completed_reps?: number;

    @ApiProperty({ example: 4 })
    @IsNumber()
    completed_sets?: number;

    @IsNumber()
    planId: number;
}
