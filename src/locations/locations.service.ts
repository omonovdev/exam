import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { handleError } from 'src/utils/hande-error';
import { resSuccess } from 'src/utils/succes-response';
import { validateUUID } from 'src/utils/validate-uuid';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<any> {
    try {
      const existingLocation = await this.locationRepository.findOne({
        where: {
          address: createLocationDto.address,
          city: createLocationDto.city,
        },
      });

      if (existingLocation) {
        throw new BadRequestException(
          'Location with this address already exists in this city',
        );
      }

      const location = this.locationRepository.create(createLocationDto);
      const savedLocation = await this.locationRepository.save(location);

      return resSuccess({
        message: 'Location created successfully',
        data: savedLocation,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find({
      relations: ['hospitals'],
    });
  }

  async findOne(id: string): Promise<Location | null> {
    validateUUID(id, 'Location ID');
    return await this.locationRepository.findOne({
      where: { id },
      relations: ['hospitals'],
    });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<any> {
    try {
      validateUUID(id, 'Location ID');
      const location = await this.findOne(id);
      if (!location) {
        throw new NotFoundException('Not found location');
      }
      await this.locationRepository.update(id, updateLocationDto);
      return resSuccess(updateLocationDto);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      validateUUID(id, 'Location ID');
      const location = await this.locationRepository.findOne({ where: { id } });
      if (!location) {
        throw new NotFoundException('Location not found');
      }
      await this.locationRepository.delete(id);
      return resSuccess({ message: 'Location deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
