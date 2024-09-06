import { ApiProperty } from "@nestjs/swagger";

export class ProfileView {

    @ApiProperty({ example: 'user' })
    username: string;

    @ApiProperty({ example: 3 })
    simultaneousFlowLimit: number;

}