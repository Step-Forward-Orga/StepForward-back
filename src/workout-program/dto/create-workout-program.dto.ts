import { ApiProperty } from "@nestjs/swagger";

export class CreateWorkoutProgramDto {
    @ApiProperty({ example: "Beginner Program" })
    title: string;

    @ApiProperty({ example: "A program designed for beginners to build foundational strength." })
    description: string
}
