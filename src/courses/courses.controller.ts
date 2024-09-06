import { Controller, Get, Render, Param, UseGuards, Inject, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { viewConfig } from '../configs/view.config';
import { ApiTags } from '@nestjs/swagger';
import { dataCoursesConst } from './constants/curses.const';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { REQUEST } from '@nestjs/core';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
    constructor(
        @Inject(REQUEST) private readonly req: Request,
        private readonly coursesService: CoursesService
    ) { }

    @Get()
    @Render('courses')
    coursesPage() {
        return { viewConfig, dataCourses: dataCoursesConst };;
    }

    @Get('details/:curseId')
    @Render('courses-details')
    coursesDetailsPage(@Param('curseId') curseId: string) {
        const dataCourse = dataCoursesConst.find(c => c.id == curseId)
        return { viewConfig, curseId, curseTitle: dataCourse.title };
    }

    @Get('file/:curseId/:deviceId')
    @UseGuards(JwtAuthGuard)
    findCourse(@Param('curseId') curseId: string,@Param('deviceId') deviceId: string) {
        return this.coursesService.findCourse(this.req['user']['userId'], curseId,deviceId);
    }

    @Post('renewal-bond')
    @UseGuards(JwtAuthGuard)
    renewalBond(@Body('deviceId') deviceId: string) {
        return this.coursesService.renewalBond(this.req['user']['userId'], deviceId);
    }

    @Post('close-video')
    @UseGuards(JwtAuthGuard)
    closeVideo(@Body('deviceId') deviceId: string) {
        return this.coursesService.closeVideo(this.req['user']['userId'], deviceId);
    }

}