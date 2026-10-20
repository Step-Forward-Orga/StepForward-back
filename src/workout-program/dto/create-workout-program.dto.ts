import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateWorkoutProgramDto {
    @ApiProperty({ example: "Beginner Program" })
    @IsString()
    title: string;

    @ApiProperty({ example: "A program designed for beginners to build foundational strength." })
    @IsOptional()
    @IsString()
    description: string
}
