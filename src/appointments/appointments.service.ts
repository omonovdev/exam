import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<any> {
    try {
      const existingAppointment = await this.appointmentRepository.findOne({
        where: {
          doctor_id: createAppointmentDto.doctor_id,
          appointment_date: createAppointmentDto.appointment_date,
          appointment_time: createAppointmentDto.appointment_time,
        },
      });

      if (existingAppointment) {
        throw new BadRequestException(
          'Doctor already has an appointment at this time and date',
        );
      }

      const appointment =
        this.appointmentRepository.create(createAppointmentDto);
      const savedAppointment =
        await this.appointmentRepository.save(appointment);

      return resSuccess({
        message: 'Appointment created successfully',
        data: savedAppointment,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      relations: ['hospital', 'doctor', 'patient'],
    });
  }

  async findOne(id: string): Promise<Appointment | null> {
    validateUUID(id, 'Appointment ID');
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ['hospital', 'doctor', 'patient'],
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    try {
      validateUUID(id, 'Appointment ID');
      const appointment = await this.findOne(id);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      if (
        updateAppointmentDto.doctor_id &&
        updateAppointmentDto.appointment_date &&
        updateAppointmentDto.appointment_time
      ) {
        const existingAppointment = await this.appointmentRepository.findOne({
          where: {
            doctor_id: updateAppointmentDto.doctor_id,
            appointment_date: updateAppointmentDto.appointment_date,
            appointment_time: updateAppointmentDto.appointment_time,
          },
        });
        if (existingAppointment && existingAppointment.id !== id) {
          throw new BadRequestException(
            'Doctor already has an appointment at this time and date',
          );
        }
      }

      await this.appointmentRepository.update(id, updateAppointmentDto);
      return resSuccess(updateAppointmentDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Appointment ID');
      const appointment = await this.appointmentRepository.findOne({
        where: { id },
      });
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }
      await this.appointmentRepository.delete(id);
      return resSuccess({ message: 'Appointment deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
