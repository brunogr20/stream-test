import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaProvider } from 'src/common/providers/prisma.provider';
import { UsersRepository } from './repositories/prisma/users.repository';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
    imports: [CoursesModule],
    providers: [
        PrismaProvider,
        UsersService,
        {
            provide: 'UsersRepository',
            useClass: UsersRepository,
        },
    ],
    controllers: [UsersController],
})
export class UsersModule { }