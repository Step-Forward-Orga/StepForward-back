import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExerciseEntity } from "src/exercise/entities/exercise.entity";
import { SetEntity } from "./set.entity";
import { NotesEntity } from "src/notes/entities/notes.entity";
import { WorkoutEntity } from "src/workout/entities/workout.entity";

export class WorkoutExerciseEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    exerciseId: number;

    @ApiProperty({ type: () => ExerciseEntity })
    @Type(() => ExerciseEntity)
    exercise: ExerciseEntity;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    @ApiProperty({ type: () => [SetEntity] })
    @Type(() => SetEntity)
    plannedSets?: SetEntity[];

    @ApiProperty({ example: "PTM3M" })
    restTime: string;

    @ApiProperty({ type: () => [SetEntity] })
    @Type(() => SetEntity)
    completedSets?: SetEntity[];

    @ApiProperty({ example: false })
    completed?: boolean;

    @ApiProperty({ example: new Date() })
    completedAt?: Date;

    @ApiProperty({ example: 1 })
    noteId?: number;

    @ApiProperty({ type: () => NotesEntity })
    @Type(() => NotesEntity)
    note?: NotesEntity

    @ApiProperty({ example: 1 })
    workoutId?: number;

    @ApiProperty({ type: () => WorkoutEntity })
    @Type(() => WorkoutEntity)
    workout?: WorkoutEntity;

    constructor(partial: Partial<WorkoutExerciseEntity>) {
        Object.assign(this, partial)

        if (partial.exercise && !(partial.exercise instanceof ExerciseEntity)) {
            this.exercise = new ExerciseEntity(partial.exercise);
        }

        if (partial.note && !(partial.note instanceof NotesEntity)) {
            this.note = new NotesEntity(partial.note);
        }

        if (partial.workout && !(partial.workout instanceof WorkoutEntity)) {
            this.workout = new WorkoutEntity(partial.workout);
        }

        if (partial.plannedSets) {
            this.plannedSets = partial.plannedSets.map((set) => new SetEntity(set));
        }

        if (partial.completedSets) {
            this.completedSets = partial.completedSets.map((set) => new SetEntity(set));
        }
    }
}
