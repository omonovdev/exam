import { IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  region: string;
}
