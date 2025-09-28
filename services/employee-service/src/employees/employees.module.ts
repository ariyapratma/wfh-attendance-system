import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from "src/entities/employee.entity";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    controllers: [EmployeesController],
    providers: [EmployeesService],
})
export class EmployeesModule {}