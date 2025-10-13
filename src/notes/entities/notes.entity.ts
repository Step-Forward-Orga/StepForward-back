import { ApiProperty } from "@nestjs/swagger";

import { UserEntity } from "../../user/entities/user.entity";
import { WorkoutEntity } from "../../workout/entities/workout.entity";
import { ExerciseEntity } from "../../exercise/entities/exercise.entity";

export class NotesEntity {
    @ApiProperty({ example: 1})
    id: number;

    @ApiProperty({ example: 1})
    userId: number;

    @ApiProperty({ example: "Example Title" })
    title: string;

    @ApiProperty({ example: "note content" })
    note: string;

    @ApiProperty({ example: "2024-11-29T10:43:11.376Z" })
    createdAt: Date;

    @ApiProperty({ example: 1 })
    workoutId?: number;

    @ApiProperty({ example: WorkoutEntity })
    workout?: WorkoutEntity;

    // workoutProgramId?: number;

    // workoutProgram?: WorkoutProgramEntity;

    @ApiProperty({ example: 1 })
    exerciseId?: number;

    @ApiProperty({ example: ExerciseEntity })
    exercise?: ExerciseEntity;

    @ApiProperty({ example: UserEntity })
    user: UserEntity;

    constructor(partial: Partial<NotesEntity>) {
        Object.assign(this, partial)
    }
}
