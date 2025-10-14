import { ApiProperty } from "@nestjs/swagger";
import { ExerciseEntity } from "./exercise.entity";

export class SetEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    order: number;

    @ApiProperty({ example: 10 })
    reps: number;

    @ApiProperty({ example: 50 })
    weight: number;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    @ApiProperty({ example: "PLANNED" })
    type: "PLANNED" | "COMPLETED";

    @ApiProperty({ example: 1 })
    plannedForId?: number;

    @ApiProperty({ type: () => ExerciseEntity })
    plannedFor?: ExerciseEntity;

    @ApiProperty({ example: 1 })
    completedForId?: number;

    @ApiProperty({ type: () => ExerciseEntity })
    completedFor?: ExerciseEntity;

    constructor(partial: Partial<SetEntity>) {
        Object.assign(this, partial);
    }
}