import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { WorkoutExerciseEntity } from "../../workout-exercise/entities/workout-exercise.entity";

export class ExerciseEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Squat" })
    name: string; // name

    @ApiProperty({ example: "squat movement great for leg growth and gaining strength" })
    description: string; // desc

    @ApiProperty({ type: () => [WorkoutExerciseEntity] })
    @Type(() => WorkoutExerciseEntity)
    workoutExercises?: WorkoutExerciseEntity[];

    constructor(partial: Partial<ExerciseEntity>) {
        Object.assign(this, partial)

        if (partial.workoutExercises) {
            this.workoutExercises = partial.workoutExercises.map((set) => new WorkoutExerciseEntity(set));
        }
    }
}