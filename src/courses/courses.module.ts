import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { RedisProvider } from '../common/providers/redis.provider';
import { UsersRepository } from '../users/repositories/prisma/users.repository';
import { PrismaProvider } from '../common/providers/prisma.provider';

@Module({
  controllers: [CoursesController],
  providers: [
    PrismaProvider,
    RedisProvider,
    CoursesService,
    {
      provide: 'UsersRepository',
      useClass: UsersRepository,
  },
  ],
  exports: [CoursesService]
})
export class CoursesModule { }
