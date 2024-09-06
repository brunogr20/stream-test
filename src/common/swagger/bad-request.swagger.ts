import { ApiProperty } from '@nestjs/swagger';

export class BadRequestSwagger {
    @ApiProperty({ example: '400' })
    statusCode: number;

    @ApiProperty({ example: 'Invalid parameters' })
    message: string[];

    @ApiProperty({ example: 'Bad Request' })
    error: string;
}
