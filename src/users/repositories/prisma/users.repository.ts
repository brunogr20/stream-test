import { Injectable } from '@nestjs/common';
import { UsersRepositoryAbstract } from './users.repository.abstract';
import { PrismaProvider } from 'src/common/providers/prisma.provider';
import { UserModel } from 'src/users/models/user.model';
import { PrismaUserMapper } from './user.mapper';

@Injectable()
export class UsersRepository implements UsersRepositoryAbstract {
  constructor(private prisma: PrismaProvider) { }

  public async create(user: UserModel): Promise<UserModel> {
    const prismaUserData = PrismaUserMapper.toPrisma(user);

    const userData = await this.prisma.user.create({
      data: prismaUserData,
    });

    return PrismaUserMapper.toDomain(userData);
  }

  public async login(username: string, password: string): Promise<UserModel> {

    const userData = await this.prisma.user.findFirst({
      where: { username, password },
    });

    return userData ? PrismaUserMapper.toDomain(userData) : null;
  }

  public async findByUsername(username: string): Promise<UserModel> {

    const userData = await this.prisma.user.findFirst({
      where: { username },
    });

    return userData ? PrismaUserMapper.toDomain(userData) : null;
  }

  public async findById(id: string): Promise<UserModel> {

    const userData = await this.prisma.user.findFirst({
      where: { id },
    });

    return userData ? PrismaUserMapper.toDomain(userData) : null;
  }

  public async update(id: string, data: UserModel): Promise<UserModel> {

    const userData = await this.prisma.user.update({
      where: { id },
      data: PrismaUserMapper.toPrisma(data),
    });

    return userData ? PrismaUserMapper.toDomain(userData) : null;
  }

}