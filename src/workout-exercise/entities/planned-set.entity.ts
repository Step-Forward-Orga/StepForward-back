import { ApiProperty } from "@nestjs/swagger";

export class PlannedSetEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    order: number;

    @ApiProperty({ example: 8 })
    repsMin: number;

    @ApiProperty({ example: 10 })
    repsMax: number;

    @ApiProperty({ example: 80, nullable: true })
    weight: number | null;

    @ApiProperty({ example: 1 })
    workoutExerciseId: number;

    constructor(partial: Partial<PlannedSetEntity>) {
        Object.assign(this, partial);
    }
}
