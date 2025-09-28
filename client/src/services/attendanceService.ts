import axios from "axios";

const attendanceApi = axios.create({
    baseURL: "http://localhost:3003",
});

interface Attendance {
    id: number;
    employeeId: number;
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    photoPath: string | null;
    createdAt: string;
    updatedAt: string;
};

interface CheckInData {
    employeeId: number;
    date: string;
};

interface CheckOutData { 
    checkOutTime: string;
}

export const checkIn = async (data: CheckInData): Promise<Attendance> => {
  const response = await attendanceApi.post('/attendances/check-in', data);
  return response.data;
};

export const checkOut = async (attendanceId: number, data: CheckOutData): Promise<Attendance> => {
  const response = await attendanceApi.patch(`/attendances/${attendanceId}`, data);
  return response.data;
};


export const getAttendanceByEmployeeId = async (employeeId: number): Promise<Attendance[]> => {
  const response = await attendanceApi.get(`/attendances/${employeeId}`);
  return response.data;
};

export const getAllAttendances = async (): Promise<Attendance[]> => {
  const response = await attendanceApi.get('/attendances');
  return response.data;
};

export const getAttendanceById = async (id: number): Promise<Attendance> => {
  const response = await attendanceApi.get(`/attendances/detail/${id}`);
  return response.data;
};
