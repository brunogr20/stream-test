import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { dataCoursesConst } from './constants/curses.const';
import { RedisProvider } from '../common/providers/redis.provider';
import { UsersRepositoryAbstract } from '../users/repositories/prisma/users.repository.abstract';
import { getUserKeyName, showFile } from './helpers/utils';

const SEG15 = 15*1000;

@Injectable()
export class CoursesService {

    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: UsersRepositoryAbstract,
        private redisProvider: RedisProvider
    ) { }

    async findCourse(userId: string, curseId: string,deviceId:string) {
        const keyName = getUserKeyName(userId);
        const dataCourse = dataCoursesConst.find(c => c.id == curseId);

        const [user,hasDevice] = await Promise.all([
            this.usersRepository.findById(userId),
            this.redisProvider.get(`${keyName}:${deviceId}`)
        ]);

        if(hasDevice) return showFile(dataCourse.file);

        const totalActive = await this.streamsActive(userId);

        if(totalActive >= user.simultaneousFlowLimit){
            throw new NotAcceptableException('Max streams reached');
        }

        await this.redisProvider.set(`${keyName}:${deviceId}`, 'ok', SEG15);

        return showFile(dataCourse?.file);
    }

    async renewalBond(userId: string ,deviceId:string) {
        await this.redisProvider.set(`${getUserKeyName(userId)}:${deviceId}`, 'ok', SEG15);
    }
    
    async closeVideo(userId: string ,deviceId:string) {
        await this.redisProvider.del(`${getUserKeyName(userId)}:${deviceId}`);
    }
    
    async streamsActive(userId: string) {
        const keys = await this.redisProvider.keys();
        const keyName = getUserKeyName(userId);

        const keysCache = keys.filter(
            (key) => key.substring(0, keyName.length) == keyName,
           );

       return keysCache?.length || 0;
    }

}
