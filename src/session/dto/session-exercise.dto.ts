import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class AddSessionExerciseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    exerciseId: number;

    @ApiPropertyOptional({ example: 'left shoulder a bit sore' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: 3, description: 'defaults to the end of the session' })
    @IsOptional()
    @IsInt()
    order?: number;
}

export class UpdateSessionExerciseDto extends PartialType(PickType(AddSessionExerciseDto, ['note', 'order'])) {}
