import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    limit?: number = 10;

    @ApiPropertyOptional({ example: 'createdAt' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc';

    @ApiPropertyOptional({ example: 'note,workout' })
    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
        ? value.split(',').map((item: string) => item.trim()).filter(Boolean)
        : []
    )
    include?: string[];
}