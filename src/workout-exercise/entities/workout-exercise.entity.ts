import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ExerciseEntity } from "../../exercise/entities/exercise.entity";
import { PlannedSetEntity } from "./planned-set.entity";
import { NotesEntity } from "../../notes/entities/notes.entity";
import { WorkoutEntity } from "../../workout/entities/workout.entity";

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

    @ApiProperty({ example: 1 })
    order: number;

    @ApiProperty({ type: () => [PlannedSetEntity] })
    @Type(() => PlannedSetEntity)
    plannedSets?: PlannedSetEntity[];

    @ApiProperty({ example: "PT3M" })
    restTime: string;

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
            this.plannedSets = partial.plannedSets.map((set) => new PlannedSetEntity(set));
        }
    }
}
