import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException } from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Get()
    async findAll() {
        return await this.employeesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const numId = +id;
        if (isNaN(numId) || numId <= 0) {
            throw new NotFoundException(`Invalid ID format: ${id}`);
        }
        return await this.employeesService.findOne(numId);
    }

    @Post()
    async create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return await this.employeesService.create(createEmployeeDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        const numId = +id;
        if (isNaN(numId) || numId <= 0) {
            throw new NotFoundException(`Invalid ID format: ${id}`);
        }
        return await this.employeesService.update(numId, updateEmployeeDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string) {
        const numId = +id;
        if (isNaN(numId) || numId <= 0) {
            throw new NotFoundException(`Invalid ID format: ${id}`);
        }
        return await this.employeesService.remove(numId);
    }
}