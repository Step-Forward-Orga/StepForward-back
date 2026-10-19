import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';

export class GetNotesQueryDto extends BaseQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    workoutId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    workoutProgramId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    workoutExerciseId?: number;
}