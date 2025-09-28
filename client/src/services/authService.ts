import api from "./api";

interface LoginCredentials {
    username: string;
    password: string;
};

interface LoginResponse { 
    id: number;
    username: string;
    role: string;
    employeeId: number | null;
    createdAt: string;
    updatedAt: string;
};

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};
