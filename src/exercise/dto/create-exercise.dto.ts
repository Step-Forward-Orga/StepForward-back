import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateExerciseDto {
    @ApiProperty({ example: 'Bench' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'this is a description', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
