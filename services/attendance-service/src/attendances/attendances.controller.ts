import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { AttendancesService } from "./attendances.service";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = path.extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

@Controller('attendances')
export class AttendancesController {
    constructor(private readonly attendancesService: AttendancesService) { }

    @Get()
    async findAll() {
        return this.attendancesService.findAll();
    }

    @Get(':employeeId')
    async findByEmployeeId(@Param('employeeId') employeeId: string) {
        return this.attendancesService.findByEmployeeId(+employeeId);
    }

    @Get('detail/:id')
    async findOne(@Param('id') id: string) {
        return this.attendancesService.findOne(+id);
    }

    @Post('check-in')
    @UseInterceptors(FileInterceptor('photo', {
        storage: diskStorage({
            destination: './uploads/attendance',
            filename: editFileName,
        }),
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    async checkIn(
        @Body() createAttendanceDto: CreateAttendanceDto,
        @UploadedFile() file: MulterFile
    ) {
        const attendanceWithPhoto = {
            ...createAttendanceDto,
            photoPath: file ? file.path : null,
        };
        return this.attendancesService.checkIn(attendanceWithPhoto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
        return this.attendancesService.update(+id, updateAttendanceDto);
    }

    @Patch('check-out')
    async checkout(@Body() updateAttendanceDto: UpdateAttendanceDto, @Req() req: Request) {
        const employeeId = req.body.employeeId || 1;
        const date = new Date().toISOString().split('T')[0];
        return this.attendancesService.checkOut(employeeId, date, updateAttendanceDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        return this.attendancesService.remove(+id);
    }
}