import { ApiProperty } from "@nestjs/swagger";
import { ExerciseEntity } from "../../exercise/entities/exercise.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { NotesEntity } from "../../notes/entities/notes.entity";
import { Type } from "class-transformer";
import { WorkoutProgramEntity } from "../../workout-program/entities/workout-program.entity";

export class WorkoutEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    userId: number;
    
    @ApiProperty({ example: "Upper 1" })
    title: string;

    @ApiProperty({ example: "First upper workout of the program" })
    description: string;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    @ApiProperty({ example: 1 })
    noteId?: number;

    @ApiProperty({ example: 1})
    workoutCycleId?: number;

    @ApiProperty({ type: () => NotesEntity})
    @Type(() => NotesEntity)
    note?: NotesEntity;

    @ApiProperty({ type: () => UserEntity })
    @Type(() => UserEntity)
    user: UserEntity;

    @ApiProperty({ type: () => [ExerciseEntity] })
    @Type(() => ExerciseEntity)
    exercises?: ExerciseEntity[];

    @ApiProperty({ example: 1 })
    workoutProgramId?: number;

    @ApiProperty({ type: () => WorkoutProgramEntity })
    @Type(() => WorkoutProgramEntity)
    workoutProgram?: WorkoutProgramEntity;

    constructor(partial: Partial<WorkoutEntity>) {
        Object.assign(this, partial)

        if (partial.user) {
            this.user = new UserEntity(partial.user);
        }

        if (partial.note) {
            this.note = new NotesEntity(partial.note);
        }

        if (partial.exercises) {
            this.exercises = partial.exercises.map((exercise) => new ExerciseEntity(exercise));
        }

        if (partial.workoutProgram) {
            this.workoutProgram = new WorkoutProgramEntity(partial.workoutProgram);
        }
    }
}
