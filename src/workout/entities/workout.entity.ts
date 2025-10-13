import { ApiProperty } from "@nestjs/swagger";
import { ExerciseEntity } from "../../exercise/entities/exercise.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { NotesEntity } from "../../notes/entities/notes.entity";

export class WorkoutEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Upper 1" })
    title: string;

    @ApiProperty({ example: "First upper workout of the program" })
    description: string;

    @ApiProperty({ example: new Date() })
    createdAt: Date;

    @ApiProperty({ example: 1 })
    userId: number;

    @ApiProperty({ example: UserEntity })
    user: UserEntity;

    @ApiProperty({ example: [ExerciseEntity] })
    exercises: ExerciseEntity[];

    @ApiProperty({ example: 1 })
    noteId?: number;

    @ApiProperty({ example: NotesEntity})
    note: NotesEntity;

    // workoutProgramId: number;
    // workoutProgram: WorkoutProgramEntity;

    constructor(partial: Partial<WorkoutEntity>) {
        Object.assign(this, partial)
    }
}
