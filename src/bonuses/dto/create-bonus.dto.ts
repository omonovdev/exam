import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBonusDto {
  @IsUUID()
  salary_id: string;

  @IsString()
  bonus_type: string;

  @IsNumber()
  amount: number;

  @IsString()
  reason?: string;
}
