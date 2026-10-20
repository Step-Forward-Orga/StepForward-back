import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';

export class GetWorkoutsQueryDto extends BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    workoutProgramId?: number;
}