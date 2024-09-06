import { RedisProvider } from 'src/common/providers/redis.provider';
import { CoursesService } from './courses.service';
import { UsersRepositoryAbstract } from 'src/users/repositories/prisma/users.repository.abstract';
import { UserModel } from '../users/models/user.model';
import  * as fnUtils  from './helpers/utils';
import { viewConfig } from '../configs/view.config';

describe('VideosService', () => {
  let coursesService: CoursesService;

  const fakeUserRepository: UsersRepositoryAbstract = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
    login: jest.fn(),
    update: jest.fn(),
  };

  const fakeRedisProvider = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn()
  } as unknown as RedisProvider

  beforeEach(async () => {
    coursesService = new CoursesService(
      fakeUserRepository,
      fakeRedisProvider
    );
  });

  it('should be defined', () => {
    expect(coursesService).toBeDefined();
  });

  describe('findCourse', () => {
    it('should return video url ', async () => {

      const courseId = 'xxx';
      const userModel = new UserModel({
        id:'123',
        username:'id.x',
        simultaneousFlowLimit:3
     });
      const resultSuccess = {
        url: `${viewConfig.baseUrlVideos}/url.abc`,
      }

      jest
        .spyOn(fakeUserRepository, 'findById')
        .mockImplementation(async () => userModel);

      jest
        .spyOn(fakeRedisProvider, 'get')
        .mockImplementation(async () => null);

      jest
        .spyOn(coursesService, 'streamsActive')
        .mockImplementation(async () => 1);

      jest.spyOn(fnUtils, 'showFile').mockReturnValue({url:resultSuccess.url});

      expect(await coursesService.findCourse(userModel.id,courseId,'yyy')).toEqual(
        resultSuccess,
      );
    });
  });

  describe('renewalBond', () => {
    it('should return renewal bond', async () => {

      await coursesService.renewalBond('123','yyy');

      expect(fakeRedisProvider.set).toHaveBeenCalled();
    });
  });

  describe('closeVideo', () => {
    it('should return del', async () => {

      await coursesService.closeVideo('123','yyy');

      expect(fakeRedisProvider.del).toHaveBeenCalled();
    });
  });

  describe('streamsActive', () => {
    it('should return the total number of active streams', async () => {
      const dataCache = 'user:123';

      jest
      .spyOn(fakeRedisProvider, 'keys')
      .mockImplementation(async () => [`${dataCache}:device1`]);

      jest.spyOn(fnUtils, 'getUserKeyName').mockReturnValue(dataCache);

      expect(await coursesService.streamsActive('123')).toEqual(1);

    });
  });

});
