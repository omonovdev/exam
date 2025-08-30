import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    try {
      const existingPatient = await this.patientRepository.findOne({
        where: { phone: createPatientDto.phone },
      });

      if (existingPatient) {
        throw new BadRequestException(
          'Patient with this phone number already exists',
        );
      }

      const patient = this.patientRepository.create(createPatientDto);
      const savedPatient = await this.patientRepository.save(patient);

      return resSuccess({
        message: 'Patient created successfully',
        data: savedPatient,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      relations: ['appointments'],
    });
  }

  async findOne(id: string): Promise<Patient | null> {
    validateUUID(id, 'Patient ID');
    return await this.patientRepository.findOne({
      where: { id },
      relations: ['appointments'],
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<any> {
    try {
      validateUUID(id, 'Patient ID');
      const patient = await this.findOne(id);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      // Check if phone number is being updated and already exists
      if (updatePatientDto.phone) {
        const existingPatient = await this.patientRepository.findOne({
          where: { phone: updatePatientDto.phone },
        });
        if (existingPatient && existingPatient.id !== id) {
          throw new BadRequestException(
            'Phone number already exists for another patient',
          );
        }
      }

      await this.patientRepository.update(id, updatePatientDto);
      return resSuccess(updatePatientDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Patient ID');
      const patient = await this.patientRepository.findOne({ where: { id } });
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }
      await this.patientRepository.delete(id);
      return resSuccess({ message: 'Patient deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
