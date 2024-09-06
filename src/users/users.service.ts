import { ForbiddenException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepositoryAbstract } from './repositories/prisma/users.repository.abstract';
import { UserModel } from './models/user.model';
import { encryptPassword } from './../common/helpers/utils';
import { CreateView } from './views/create.view';
import { ProfileView } from './views/profile.view';
import { UpdateUserDto } from './dto/update-user.dto';
import { CoursesService } from './../courses/courses.service';

@Injectable()
export class UsersService {

    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: UsersRepositoryAbstract,
        private readonly coursesService: CoursesService
    ) { }

    async create(user: CreateUserDto): Promise<CreateView> {
        const checkUser = await this.usersRepository.findByUsername(user.username);

        if (checkUser) throw new NotAcceptableException('User already exists');

        try {
            const newUser = await this.usersRepository.create(new UserModel({
                username: user.username,
                simultaneousFlowLimit: Number(user.simultaneousFlowLimit),
                password: encryptPassword(user.password)
            }))

            if (!newUser) throw new Error();

            return { message: 'Registration completed successfully' }
        } catch (e) {
            throw new Error('Error')
        }

    }

    async profile(username: string): Promise<ProfileView> {
        const user = await this.usersRepository.findByUsername(username);

        return {
            username: user.username,
            simultaneousFlowLimit: user.simultaneousFlowLimit,
        }
    }

    async updateProfile(id: string, dataUser: UpdateUserDto): Promise<void> {
        const simultaneousFlowLimit = Number(dataUser.simultaneousFlowLimit);
        const checkUser = await this.usersRepository.findById(id);

        if (!checkUser) throw new NotFoundException();

        const totalActive = await this.coursesService.streamsActive(id);

        if(simultaneousFlowLimit < totalActive){
            throw new ForbiddenException('limit not allowed');
        }

        const dataUpdate = new UserModel({ simultaneousFlowLimit });

        if (dataUser?.password) {
            dataUpdate.password = encryptPassword(dataUser.password)
        }

        await this.usersRepository.update(id, dataUpdate);
    }

}