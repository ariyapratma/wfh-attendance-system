import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'employee_id', type: 'int' })
    employeeId: number; // Foreign key to Employee entity

    @Column({ type: 'date' })
    date: string;

    @Column({ name: 'check_in', type: 'time', nullable: true })
    checkInTime: string | null;

    @Column({ name: 'check_out', type: 'time', nullable: true })
    checkOutTime: string | null;

    @Column({ name : 'photo_path', type: 'varchar', length: 255, nullable: true })
    photoPath: string | null; // Path to the stored photo

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}