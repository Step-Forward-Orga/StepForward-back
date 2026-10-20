import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class LogSetDto {
    @ApiProperty({ example: 8 })
    @IsInt()
    @Min(0)
    reps: number;

    @ApiProperty({ example: 80 })
    @IsNumber()
    @Min(0)
    weight: number;

    @ApiPropertyOptional({ example: 'felt heavy' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: 1, description: 'defaults to the next set' })
    @IsOptional()
    @IsInt()
    order?: number;
}

export class UpdateLoggedSetDto extends PartialType(LogSetDto) {}
