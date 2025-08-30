import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Salary } from '../../salary/entities/salary.entity';

@Entity('bonuses')
export class Bonus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'salary_id' })
  salary_id: string;

  @Column()
  bonus_type: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @ManyToOne(() => Salary, (salary) => salary.bonuses)
  @JoinColumn({ name: 'salary_id' })
  salary: Salary;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
