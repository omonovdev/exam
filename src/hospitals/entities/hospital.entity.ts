import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'location_id' })
  location_id: string;

  @ManyToOne(() => Location, (location) => location.hospitals)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => Worker, (worker) => worker.hospital)
  workers: Worker[];

  @OneToMany(() => Appointment, (appointment) => appointment.hospital)
  appointments: Appointment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
