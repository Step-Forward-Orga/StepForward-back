import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateSessionDto {
    @ApiPropertyOptional({ example: 'Upper 1' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'good energy today' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiPropertyOptional({ example: new Date().toISOString(), description: 'set it to finish the session' })
    @IsOptional()
    @IsDateString()
    finishedAt?: string;
}
