import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class PlannedSetDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    order: number;

    @ApiProperty({ example: 8 })
    @IsInt()
    @Min(1)
    repsMin: number;

    @ApiProperty({ example: 10, description: 'same as repsMin for a fixed rep target' })
    @IsInt()
    @Min(1)
    repsMax: number;

    @ApiPropertyOptional({ example: 80 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: number;
}
