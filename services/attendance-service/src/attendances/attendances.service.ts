import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendancesRepository: Repository<Attendance>,
  ) { }

  async checkIn(createAttendanceDto: CreateAttendanceDto & { photoPath?: string }): Promise<Attendance> {
    let attendance = await this.attendancesRepository.findOne({
      where: {
        employeeId: createAttendanceDto.employeeId,
        date: createAttendanceDto.date,
      },
    });

    if (attendance) {
      if (attendance.checkOutTime) {
        throw new Error('Already checked out for today. Cannot check in again.');
      }
      if (!attendance.checkInTime) {
        attendance.checkInTime = new Date().toTimeString().split(' ')[0];
      }
      if (createAttendanceDto.photoPath) {
        attendance.photoPath = createAttendanceDto.photoPath;
      }
    } else {
      attendance = this.attendancesRepository.create({
        employeeId: createAttendanceDto.employeeId,
        date: createAttendanceDto.date,
        checkInTime: new Date().toTimeString().split(' ')[0],
        photoPath: createAttendanceDto.photoPath,
      });
    }

    return await this.attendancesRepository.save(attendance);
  }

  async checkOut(employeeId: number, date: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.attendancesRepository.findOne({
      where: {
        employeeId: employeeId,
        date: date,
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record for employee ${employeeId} on date ${date} not found.`);
    }

    if (attendance.checkOutTime) {
      throw new Error('Already checked out for today.');
    }

    attendance.checkOutTime = updateAttendanceDto.checkOutTime ?? null;
    // photoPath bisa diupdate di sini jika diperlukan

    return await this.attendancesRepository.save(attendance);
  }

  async findByEmployeeId(employeeId: number): Promise<Attendance[]> {
    return await this.attendancesRepository.find({
      where: { employeeId: employeeId },
      order: { date: 'DESC' },
    });
  }

  async findAll(): Promise<Attendance[]> {
    return await this.attendancesRepository.find({
      order: { date: 'DESC', employeeId: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendancesRepository.findOneBy({ id });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    Object.assign(attendance, updateAttendanceDto);
    return await this.attendancesRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendancesRepository.remove(attendance);
  }
}