import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateSessionDto {
    @ApiPropertyOptional({ example: 1, description: 'workout template to start from; its exercises are copied in' })
    @IsOptional()
    @IsInt()
    workoutId?: number;

    @ApiPropertyOptional({ example: 'Upper 1', description: 'defaults to the workout title' })
    @IsOptional()
    @IsString()
    title?: string;
}
