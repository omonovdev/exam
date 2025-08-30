import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker } from './entities/worker.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
  ) {}

  async create(createWorkerDto: CreateWorkerDto): Promise<any> {
    try {
      const existingWorker = await this.workerRepository.findOne({
        where: { phone: createWorkerDto.phone },
      });

      if (existingWorker) {
        throw new BadRequestException(
          'Worker with this phone number already exists',
        );
      }

      const worker = this.workerRepository.create(createWorkerDto);
      const savedWorker = await this.workerRepository.save(worker);

      return resSuccess({
        message: 'Worker created successfully',
        data: savedWorker,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Worker[]> {
    return await this.workerRepository.find({
      relations: ['hospital', 'appointments', 'salaries'],
    });
  }

  async findOne(id: string): Promise<Worker | null> {
    validateUUID(id, 'Worker ID');
    return await this.workerRepository.findOne({
      where: { id },
      relations: ['hospital', 'appointments', 'salaries'],
    });
  }

  async update(id: string, updateWorkerDto: UpdateWorkerDto): Promise<any> {
    try {
      validateUUID(id, 'Worker ID');
      const worker = await this.findOne(id);
      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      // Check if phone number is being updated and already exists
      if (updateWorkerDto.phone) {
        const existingWorker = await this.workerRepository.findOne({
          where: { phone: updateWorkerDto.phone },
        });
        if (existingWorker && existingWorker.id !== id) {
          throw new BadRequestException(
            'Phone number already exists for another worker',
          );
        }
      }

      await this.workerRepository.update(id, updateWorkerDto);
      return resSuccess(updateWorkerDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Worker ID');
      const worker = await this.workerRepository.findOne({ where: { id } });
      if (!worker) {
        throw new NotFoundException('Worker not found');
      }
      await this.workerRepository.delete(id);
      return resSuccess({ message: 'Worker deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
