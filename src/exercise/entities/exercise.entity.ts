import { ApiProperty } from "@nestjs/swagger";
import { SetEntity } from "../../exercise/entities/set.entity";
import { WorkoutEntity } from "../../workout/entities/workout.entity";
import { NotesEntity } from "../../notes/entities/notes.entity";
import { Type } from "class-transformer";

export class ExerciseEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Squat" })
    exerciseName: string;

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

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    constructor(partial: Partial<ExerciseEntity>) {
        Object.assign(this, partial)

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