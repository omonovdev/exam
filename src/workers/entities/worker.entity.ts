import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Salary } from '../../salary/entities/salary.entity';

export enum WorkerRole {
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  GUARD = 'GUARD',
  ADMIN = 'ADMIN',
}

@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hospital_id' })
  hospital_id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: WorkerRole,
    default: WorkerRole.DOCTOR,
  })
  role: WorkerRole;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  hire_date: Date;

  @ManyToOne(() => Hospital, (hospital) => hospital.workers)
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Salary, (salary) => salary.worker)
  salaries: Salary[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
