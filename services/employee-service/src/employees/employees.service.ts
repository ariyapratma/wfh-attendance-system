import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "../entities/employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
        ) {}

        async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
            const employee = this.employeesRepository.create(createEmployeeDto);
            return await this.employeesRepository.save(employee);
        }

        async findAll(): Promise<Employee[]> {
            return await this.employeesRepository.find();
        }

        async findOne(id: number): Promise<Employee> {
            const employee = await this.employeesRepository.findOneBy({ id });
            if (!employee) {
                throw new NotFoundException(`Employee with id ${id} not found`);
            }
            return employee;
        }

        async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
            const employee = await this.findOne(id);
            Object.assign(employee, updateEmployeeDto);
            return await this.employeesRepository.save(employee);
        }

        async remove(id: number): Promise<void> { 
            const employee = await this.findOne(id);
            await this.employeesRepository.remove(employee);
        }
    }