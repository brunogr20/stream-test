import { ApiProperty } from "@nestjs/swagger";

export class LoginView {

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMyIsInN1YiI6IjIzYmI5ODFlLTE5NGUtNDkzMi05MmVjLTA0MWYzYTUxZjVkZSIsImlhdCI6MTcyNTM2OTk4NiwiZXhwIjoxNzI1NDU2Mzg2fQ.7B4KZMEXC8uQ2QIUGXBDBD_b0jI1gqAD56tzIjxP-Uc' })
    accessToken: string;

    @ApiProperty({ example: 'username' })
    username: string;

    @ApiProperty({ example: '/courses' })
    redirect: string;

}