export class UserModel {
    id: string;
    username: string;
    password: string;
    simultaneousFlowLimit: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(init?: Partial<UserModel>) {
        Object.assign(this, init);
    }

}