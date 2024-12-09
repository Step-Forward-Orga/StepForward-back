import { IsString } from "class-validator";

export class CreateWorkoutPlanDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}
