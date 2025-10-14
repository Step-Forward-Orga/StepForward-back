import { ApiProperty } from "@nestjs/swagger";
import { NotesEntity } from "src/notes/entities/notes.entity";
import { WorkoutEntity } from "src/workout/entities/workout.entity";

export class UserEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'example@mail.com' })
    email: string;

    @ApiProperty({ example: 'username' })
    username: string;

    @ApiProperty({ example: '2024-11-29T10:43:11.376Z' })
    createdAt: Date;

    @ApiProperty({ type: () => [NotesEntity] })
    Notes: NotesEntity[]; //TODO: CHANGE TO minus n and update schema

    @ApiProperty({ type: () => [WorkoutEntity] })
    workouts: WorkoutEntity[];


    workoutCycles: any[]; //change once workout program module is implemented

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)

        if (partial.Notes) {
            this.Notes = partial.Notes.map((note) => new NotesEntity(note));
        }

        if (partial.workouts) {
            this.workouts = partial.workouts.map((workout) => new WorkoutEntity(workout));
        }

        // if (partial.workoutPrograms) {
        //     this.workoutPrograms = partial.workoutPrograms.map((program) => new WorkoutProgramEntity(program));
        // }
    }
}
