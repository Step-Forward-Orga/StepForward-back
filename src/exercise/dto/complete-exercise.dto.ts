import { ApiProperty } from "@nestjs/swagger";
import { SetsDto } from "./sets.dot";
import { IsArray, IsBoolean, ValidateNested } from "class-validator";
import { Type } from "class-transformer";


export class CompleteExerciseDto {
    @ApiProperty({ type: [SetsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SetsDto)
    completedSets: SetsDto[];

    @IsBoolean()
    completed: boolean;
}