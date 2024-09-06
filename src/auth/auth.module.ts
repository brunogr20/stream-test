import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AppConfig } from 'src/configs/app.config';
import { UsersRepository } from 'src/users/repositories/prisma/users.repository';
import { PrismaProvider } from 'src/common/providers/prisma.provider';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: AppConfig.jwt.secret,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [
        PrismaProvider,
        JwtStrategy,
        AuthService,
        {
            provide: 'UsersRepository',
            useClass: UsersRepository,
        },
    ],
    controllers: [AuthController],
})
export class AuthModule { }