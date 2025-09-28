import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { AttendancesService } from "./attendances.service";
import { AttendancesController } from "./attendances.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Attendance])],
    controllers: [AttendancesController],
    providers: [AttendancesService],
})
export class AttendancesModule {}