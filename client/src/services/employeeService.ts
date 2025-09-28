import axios from "axios";

const employeeApi = axios.create({
    baseURL: "http://localhost:3002",
});

interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
    createdAt: string;
    updatedAt: string;
};

export const getAllEmployees = async (): Promise<Employee[]> => {
    const response = await employeeApi.get('/employees');
    return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await employeeApi.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const response = await employeeApi.post('/employees', employeeData);
    return response.data;
};

export const updateEmployee = async (id: number, employeeData: Partial<Employee>): Promise<Employee> => {
  const response = await employeeApi.patch(`/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
    await employeeApi.delete(`/employees/${id}`);
};

