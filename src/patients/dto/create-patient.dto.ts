import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  isPhoneNumber,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { Gender } from '../entities/patient.entity';

export class CreatePatientDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDateString()
  date_of_birth?: Date;

  @IsEnum(Gender)
  gender?: Gender;

  @IsPhoneNumber()
  @IsString()
  phone?: string;

  @IsEmail()
  @IsString()
  email?: string;

  @IsString()
  address?: string;

  @IsString()
  emergency_contact?: string;
}
