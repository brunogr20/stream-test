import { UserModel } from "src/users/models/user.model";

export abstract class UsersRepositoryAbstract {
  abstract create(user: UserModel): Promise<UserModel>;
  abstract findByUsername(username: string): Promise<UserModel>;
  abstract findById(id: string): Promise<UserModel>;
  abstract login(username: string, password: string): Promise<UserModel>;
  abstract update(id: string, user: UserModel): Promise<UserModel>;
}
