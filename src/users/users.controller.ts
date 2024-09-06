import { Controller, Get, Body, Post, Render, UseGuards, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { viewConfig } from '../configs/view.config';
import { ApiTags } from '@nestjs/swagger';
import { CreateView } from './views/create.view';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        @Inject(REQUEST) private readonly req: Request,
        private readonly usersService: UsersService
    ) { }

    @Get('sign-up')
    @Render('sign-up')
    signInPage() {
        return { viewConfig };;
    }

    @Get('my-account')
    @Render('my-account')
    myAccountPage() {
        return { viewConfig };;
    }

    @Post('sign-up')
    async signUp(@Body() newUser: CreateUserDto): Promise<CreateView> {
        return this.usersService.create(newUser);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async profile() {
        return this.usersService.profile(this.req['user']['username']);
    }

    @Post('update-profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Body() dataUser: UpdateUserDto): Promise<void> {
        return this.usersService.updateProfile(this.req['user']['userId'], dataUser);
    }

}