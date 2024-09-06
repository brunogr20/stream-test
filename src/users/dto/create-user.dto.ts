export class CreateUserDto {
    username: string;
    password: string;
    simultaneousFlowLimit: number;

    constructor(partel: Partial<CreateUserDto>) {
        Object.assign(this, partel);
    }
}