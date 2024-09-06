import {
  User as PrismaUserData,
} from '@prisma/client';
import { UserModel } from 'src/users/models/user.model';


export class PrismaUserMapper {
  static toPrisma(user: UserModel) {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      simultaneousFlowLimit: user.simultaneousFlowLimit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(
    prismaUserData: PrismaUserData
  ): UserModel {

    return new UserModel({
      id: prismaUserData.id,
      username: prismaUserData.username,
      password: prismaUserData.password,
      simultaneousFlowLimit: prismaUserData.simultaneousFlowLimit,
      createdAt: prismaUserData.createdAt,
      updatedAt: prismaUserData.updatedAt,
    });
  }

}
