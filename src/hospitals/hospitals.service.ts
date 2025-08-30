import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepository: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto): Promise<any> {
    try {
      const existingHospital = await this.hospitalRepository.findOne({
        where: { name: createHospitalDto.name },
      });

      if (existingHospital) {
        throw new BadRequestException('Hospital with this name already exists');
      }

      const hospital = this.hospitalRepository.create(createHospitalDto);
      const savedHospital = await this.hospitalRepository.save(hospital);

      return resSuccess({
        message: 'Hospital created successfully',
        data: savedHospital,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Hospital[]> {
    return await this.hospitalRepository.find({
      relations: ['location', 'workers', 'appointments'],
    });
  }

  async findOne(id: string): Promise<Hospital | null> {
    validateUUID(id, 'Hospital ID');
    return await this.hospitalRepository.findOne({
      where: { id },
      relations: ['location', 'workers', 'appointments'],
    });
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<any> {
    try {
      validateUUID(id, 'Hospital ID');
      const hospital = await this.findOne(id);
      if (!hospital) {
        throw new NotFoundException('Hospital not found');
      }

      if (updateHospitalDto.name) {
        const existingHospital = await this.hospitalRepository.findOne({
          where: { name: updateHospitalDto.name },
        });
        if (existingHospital && existingHospital.id !== id) {
          throw new BadRequestException('Hospital name already exists');
        }
      }

      await this.hospitalRepository.update(id, updateHospitalDto);
      const updatedHospital = await this.findOne(id);
      return resSuccess([updatedHospital]);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Hospital ID');
      const hospital = await this.hospitalRepository.findOne({ where: { id } });
      if (!hospital) {
        throw new NotFoundException('Hospital not found');
      }
      await this.hospitalRepository.delete(id);
      return resSuccess({ message: 'Hospital deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
