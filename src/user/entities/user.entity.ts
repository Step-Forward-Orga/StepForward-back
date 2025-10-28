import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { NotesEntity } from "../../notes/entities/notes.entity";
import { WorkoutEntity } from "../..//workout/entities/workout.entity";
import { WorkoutProgramEntity } from "../../workout-program/entities/workout-program.entity";

export class UserEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'example@mail.com' })
    email: string;

    @ApiProperty({ example: 'username' })
    username: string;

    @Exclude()
    password?: string;

    @ApiProperty({ example: '2024-11-29T10:43:11.376Z' })
    createdAt?: Date;

    @ApiProperty({ type: () => [NotesEntity] })
    @Type(() => NotesEntity)
    notes?: NotesEntity[];

    @ApiProperty({ type: () => [WorkoutEntity] })
    @Type(() => WorkoutEntity)
    workouts?: WorkoutEntity[];

    @ApiProperty({ type: () => [WorkoutEntity] })
    @Type(() => WorkoutEntity)
    workoutPrograms?: WorkoutProgramEntity[]; //change once workout program module is implemented

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)

        if (partial.notes) {
            this.notes = partial.notes.map((note) => new NotesEntity(note));
        }

        if (partial.workouts) {
            this.workouts = partial.workouts.map((workout) => new WorkoutEntity(workout));
        }

        if (partial.workoutPrograms) {
            this.workoutPrograms = partial.workoutPrograms.map((program) => new WorkoutProgramEntity(program));
        }
    }
}
