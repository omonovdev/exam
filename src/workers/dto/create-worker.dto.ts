import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { WorkerRole } from '../entities/worker.entity';

export class CreateWorkerDto {
  @IsUUID()
  hospital_id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(WorkerRole)
  role: WorkerRole;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsDateString()
  hire_date?: Date;
}
