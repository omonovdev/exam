import {
  IsString,
  IsOptional,
  IsUUID,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsUUID()
  location_id: string;
}
