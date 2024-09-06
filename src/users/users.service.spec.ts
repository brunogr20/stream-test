import { UsersService } from './users.service';
import { UsersRepositoryAbstract } from './repositories/prisma/users.repository.abstract';
import { UserModel } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CoursesService } from 'src/courses/courses.service';

describe('VideosService', () => {
  let userService: UsersService;

  const fakeUserRepository: UsersRepositoryAbstract = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
    login: jest.fn(),
    update: jest.fn(),
  };

  const fakeCoursesService = {
    streamsActive: jest.fn(),
    usersRepository: undefined,
    redisProvider: undefined,
    findCourse: jest.fn(),
    renewalBond: jest.fn(),
    closeVideo: jest.fn()
  } as unknown as CoursesService

  beforeEach(async () => {
    userService = new UsersService(
      fakeUserRepository,
      fakeCoursesService
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should return create user ', async () => {
      const dataUser = new CreateUserDto({
        username:'id.x',
        password:'123',
         simultaneousFlowLimit:3
      });
      const userModel = new UserModel({
        id:'123',
        username:dataUser.username,
        simultaneousFlowLimit:dataUser.simultaneousFlowLimit
     });

      const resultSuccess = {
        message: 'Registration completed successfully' 
      }

      jest
        .spyOn(fakeUserRepository, 'findByUsername')
        .mockImplementation(async () => null);

      jest
        .spyOn(fakeUserRepository, 'create')
        .mockImplementation(async () => userModel);

      expect(await userService.create(dataUser)).toEqual(
        resultSuccess,
      );
    });
  });

  describe('profile', () => {
    it('should return data user ', async () => {
      const userModel = new UserModel({
         id:'123',
         username:'id.x',
         simultaneousFlowLimit:3
      });

      const resultSuccess = {
        username: userModel.username,
        simultaneousFlowLimit: userModel.simultaneousFlowLimit
      }

      jest
        .spyOn(fakeUserRepository, 'findByUsername')
        .mockImplementation(async () => userModel);

      expect(await userService.profile('123')).toEqual(
        resultSuccess,
      );
    });
  });

  describe('updateProfile', () => {
    it('should return update simultaneousFlowLimit', async () => {
      const updateUser = new UpdateUserDto({
        password:'123',
         simultaneousFlowLimit:3
      });

      const userModel = new UserModel({
        id:'123',
      });

      jest
      .spyOn(fakeUserRepository, 'findById')
      .mockImplementation(async () => userModel);

      jest
        .spyOn(fakeCoursesService, 'streamsActive')
        .mockImplementation(async () => 2);

        jest
        .spyOn(fakeUserRepository, 'update')
        .mockImplementation(async () => userModel);

      await userService.updateProfile('123',updateUser);

      expect(fakeUserRepository.update).toHaveBeenCalled();
    });
  });

});
