export interface User {
    id: number;
    username: string;
    role: 'employee' | 'admin';
    employeeId: number | null;
    createdAt: string;
    updatedAt: string;
};