import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptPassword } from './../common/helpers/utils';
import { UsersRepositoryAbstract } from './../users/repositories/prisma/users.repository.abstract';
import { LoginView } from './views/login.view';

@Injectable()
export class AuthService {
    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: UsersRepositoryAbstract,
        private readonly jwtService: JwtService
    ) { }

    async login(username: string, pass: string): Promise<LoginView> {
        const user = await this.usersRepository.login(username, encryptPassword(pass))

        if (!user) return null;

        const payload = { username: user.username, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            username: user.username,
            redirect: 'courses',
        };
    }

}