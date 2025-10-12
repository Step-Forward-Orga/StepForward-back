import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { SetsDto } from "./sets.dot";

export class CreateExerciseDto {
    @ApiProperty({ example: 'Bench' })
    @IsString()
    exerciseName: string;

    // @ApiProperty({ example: 'FNEAOF'})
    // @IsString()
    // exerciseId: string;

    @ApiProperty({ type: [SetsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SetsDto)
    plannedSets: SetsDto[];

    @ApiProperty({ example: 'PTM3M' }) // ISO 8601 format
    @IsString()
    restTime: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    completed: boolean;

    @IsNumber()
    workoutId: number;
}
