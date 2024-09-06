import { ApiProperty } from "@nestjs/swagger";

export class CreateView {

    @ApiProperty({ example: 'Success' })
    message: string;

}