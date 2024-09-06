export class UpdateUserDto {
    password: string;
    simultaneousFlowLimit: number;

    constructor(partel: Partial<UpdateUserDto>) {
        Object.assign(this, partel);
    }
}