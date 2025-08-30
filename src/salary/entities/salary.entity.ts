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
import { Worker } from '../../workers/entities/worker.entity';
import { Bonus } from '../../bonuses/entities/bonus.entity';

@Entity('salary')
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workers_id' })
  workers_id: string;

  @Column({ type: 'bigint' })
  base_salary: number;

  @Column({ type: 'bigint' })
  total_salary: number;

  @ManyToOne(() => Worker, (worker) => worker.salaries)
  @JoinColumn({ name: 'workers_id' })
  worker: Worker;

  @OneToMany(() => Bonus, (bonus) => bonus.salary)
  bonuses: Bonus[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
