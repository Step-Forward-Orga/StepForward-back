import { ApiProperty } from "@nestjs/swagger";
import { SetEntity } from "../../exercise/entities/set.entity";
import { WorkoutEntity } from "src/workout/entities/workout.entity";
import { NotesEntity } from "src/notes/entities/notes.entity";

export class ExerciseEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Squat" })
    exerciseName: string;

    @ApiProperty({ example: [SetEntity] })
    plannedSets: SetEntity[];

    @ApiProperty({ example: "PTM3M" })
    restTime: string;

    @ApiProperty({ example: [SetEntity] })
    completedSets?: SetEntity[];

    @ApiProperty({ example: false })
    completed?: boolean;

    @ApiProperty({ example: new Date() })
    completedAt?: Date;

    @ApiProperty({ example: 1 })
    noteId?: number;

    @ApiProperty({ example: NotesEntity })
    note?: NotesEntity

    @ApiProperty({ example: 1 })
    workoutId: number;

    @ApiProperty({ example: WorkoutEntity })
    workout: WorkoutEntity;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    constructor(partial: Partial<ExerciseEntity>) {
        Object.assign(this, partial)
    }
}