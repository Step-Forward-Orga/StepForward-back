import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotesDto {
    @IsString()
    @ApiProperty({ example: '12/02/2024 Notes'  })
    title?: string;

    @IsString()
    @ApiProperty({ example: 'Today workout was good....'  })
    note?: string;

    @IsNumber()
    @IsOptional()
    workoutId?: number;

    @IsNumber()
    @IsOptional()
    workoutCycleId?: number;

    @IsNumber()
    @IsOptional()
    exerciseId?: number;   
}
