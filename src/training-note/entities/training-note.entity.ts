import { UserEntity } from "src/user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class TrainingNoteEntity {
    @ApiProperty({ example: 1})
    id: number;

    @ApiProperty({ example: 1})
    userId: number;

    @ApiProperty({ example: "Example Title" })
    title: string;

    @ApiProperty({ example: "note content" })
    note: string;

    @ApiProperty({ example: "2024-11-29T10:43:11.376Z" })
    createdAt: Date;

    @ApiProperty({ example: UserEntity })
    user: UserEntity;
}
