import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { Salary } from './entities/salary.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,
  ) {}

  async create(createSalaryDto: CreateSalaryDto): Promise<any> {
    try {
      const salary = this.salaryRepository.create(createSalaryDto);
      const savedSalary = await this.salaryRepository.save(salary);

      return resSuccess({
        message: 'Salary created successfully',
        data: savedSalary,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Salary[]> {
    return await this.salaryRepository.find({
      relations: ['worker', 'bonuses'],
    });
  }

  async findOne(id: string): Promise<Salary | null> {
    validateUUID(id, 'Salary ID');
    return await this.salaryRepository.findOne({
      where: { id },
      relations: ['worker', 'bonuses'],
    });
  }

  async update(id: string, updateSalaryDto: UpdateSalaryDto): Promise<any> {
    try {
      validateUUID(id, 'Salary ID');
      const salary = await this.findOne(id);
      if (!salary) {
        throw new NotFoundException('Salary not found');
      }
      await this.salaryRepository.update(id, updateSalaryDto);
      return resSuccess(updateSalaryDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Salary ID');
      const salary = await this.salaryRepository.findOne({ where: { id } });
      if (!salary) {
        throw new NotFoundException('Salary not found');
      }
      await this.salaryRepository.delete(id);
      return resSuccess({ message: 'Salary deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
