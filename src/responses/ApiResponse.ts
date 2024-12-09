import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseBody {
    @ApiProperty({ example: 401 })
    statusCode: number;

    @ApiProperty({ example: "Unauthorized" })
    error: string

    @ApiProperty({ example: "Password does not correspond | Invalid Token" })
    message?: string
}