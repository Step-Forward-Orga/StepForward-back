import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { PlannedSetDto } from "./planned-set.dto";

export class CreateWorkoutExerciseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    exerciseId: number;

    @ApiProperty({ type: [PlannedSetDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PlannedSetDto)
    plannedSets: PlannedSetDto[];

    @ApiProperty({ example: 'PT3M' }) // ISO 8601 format
    @IsString()
    restTime: string;

    @ApiPropertyOptional({ example: 1, description: 'position in the workout' })
    @IsOptional()
    @IsInt()
    order?: number;

    @IsInt()
    workoutId: number;
}
