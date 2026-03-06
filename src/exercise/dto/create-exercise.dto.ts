import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateExerciseDto {
    @ApiProperty({ example: 'Bench' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'this is a description' })
    @IsString()
    description?: string;
}
