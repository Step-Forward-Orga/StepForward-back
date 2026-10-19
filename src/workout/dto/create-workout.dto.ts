import { IsOptional, IsString } from "class-validator";

export class CreateWorkoutDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;
}
