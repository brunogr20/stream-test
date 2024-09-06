import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepositoryAbstract } from 'src/users/repositories/prisma/users.repository.abstract';
import { LoginDto } from './dto/login.dto';
import { UserModel } from '../users/models/user.model';

describe('AuthService', () => {
  const jwtService: JwtService = new JwtService();
  let authService: AuthService;

  const fakeUserRepository: UsersRepositoryAbstract = {
    create: jest.fn(),
    findByUsername: jest.fn(),
    findById: jest.fn(),
    login: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    authService = new AuthService(
      fakeUserRepository,
      jwtService
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return authentication ', async () => {
      const loginDto: LoginDto = {
        username: '123',
        password: '123',
      };

      const loginSuccessResult = {
        accessToken: 'xxx.token',
        username: loginDto.username,
        redirect: 'courses',
      }

      jest
        .spyOn(fakeUserRepository, 'login')
        .mockImplementation(async () => new UserModel({ id:'',username: loginDto.username }));

      jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(() => loginSuccessResult.accessToken);

      expect(await authService.login(loginDto.username,loginDto.password)).toEqual(
        loginSuccessResult,
      );
    });
  });
  
});
