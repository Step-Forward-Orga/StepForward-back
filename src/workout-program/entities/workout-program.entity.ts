import { ApiProperty } from "@nestjs/swagger";
import { Notes } from "@prisma/client";
import { NotesEntity } from "../../notes/entities/notes.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { WorkoutEntity } from "../../workout/entities/workout.entity";
import { Type } from "class-transformer";

export class WorkoutProgramEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: "Beginner Program" })
    title: string;

    @ApiProperty({ example: "A program designed for beginners to build foundational strength." })
    description: string;

    @ApiProperty({ example: "2024-11-29T10:43:11.376Z" })
    createdAt: Date;
    
    @ApiProperty({ example: 1 })
    noteId?: number;

    @ApiProperty({ type: () => NotesEntity })
    @Type(() => NotesEntity)
    note?: NotesEntity

    @ApiProperty({ type: () => UserEntity })
    @Type(() => UserEntity)
    user: UserEntity;

    @ApiProperty({ type: () => [WorkoutEntity] })
    @Type(() => WorkoutEntity)
    workouts?: WorkoutEntity[];

    constructor(partial: Partial<WorkoutProgramEntity>) {
        Object.assign(this, partial)

        if (partial.user) {
            this.user = new UserEntity(partial.user);
        }

        if (partial.note) {
            this.note = new NotesEntity(partial.note);
        }
        
        if (partial.workouts) {
            this.workouts = partial.workouts.map((workout) => new WorkoutEntity(workout));
        }
    }    
}