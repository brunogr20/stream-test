import { Controller, Post, Get, Render, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { viewConfig } from '../configs/view.config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../common/swagger/bad-request.swagger';
import { LoginDto } from './dto/login.dto';
import { LoginView } from './views/login.view';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    @ApiOperation({ summary: 'Login screen' })
    @Render('log-in')
    loginPage() {
        return { viewConfig };
    }

    @Post('login')
    @ApiOperation({ summary: 'Authentication' })
    @ApiBody({
        description: '',
        type: LoginDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Success',
        type: LoginView,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid parameters',
        type: BadRequestSwagger,
    })
    async login(@Body() data: LoginDto): Promise<LoginView> {
        const user = await this.authService.login(data.username, data.password);
        if (user) return user;

        throw new UnauthorizedException('Invalid credentials')
    }

}