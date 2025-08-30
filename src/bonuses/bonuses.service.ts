import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { Bonus } from './entities/bonus.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class BonusesService {
  constructor(
    @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>,
  ) {}

  async create(createBonusDto: CreateBonusDto): Promise<any> {
    try {
      const bonus = this.bonusRepository.create(createBonusDto);
      const savedBonus = await this.bonusRepository.save(bonus);

      return resSuccess({
        message: 'Bonus created successfully',
        data: savedBonus,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Bonus[]> {
    return await this.bonusRepository.find({
      relations: ['salary'],
    });
  }

  async findOne(id: string): Promise<Bonus | null> {
    validateUUID(id, 'Bonus ID');
    return await this.bonusRepository.findOne({
      where: { id },
      relations: ['salary'],
    });
  }

  async update(id: string, updateBonusDto: UpdateBonusDto): Promise<any> {
    try {
      validateUUID(id, 'Bonus ID');
      const bonus = await this.findOne(id);
      if (!bonus) {
        throw new NotFoundException('Bonus not found');
      }
      await this.bonusRepository.update(id, updateBonusDto);
      return resSuccess(updateBonusDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Bonus ID');
      const bonus = await this.bonusRepository.findOne({ where: { id } });
      if (!bonus) {
        throw new NotFoundException('Bonus not found');
      }
      await this.bonusRepository.delete(id);
      return resSuccess({ message: 'Bonus deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
