import { ApiProperty } from "@nestjs/swagger";

export class UserEntity {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: '2024-11-29T10:43:11.376Z' })
    createdAt: Date;

    @ApiProperty({ example: 'example@mail.com' })
    email: string;

    @ApiProperty({ example: 'username' })
    username: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }
}
