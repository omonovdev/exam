import { IsUUID, IsNumber } from 'class-validator';

export class CreateSalaryDto {
  @IsUUID()
  workers_id: string;

  @IsNumber()
  base_salary: number;

  @IsNumber()
  total_salary: number;
}
