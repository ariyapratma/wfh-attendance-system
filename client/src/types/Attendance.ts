export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  photoPath: string | null;
  createdAt: string;
  updatedAt: string;
}