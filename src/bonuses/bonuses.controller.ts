import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BonusesService } from './bonuses.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';

@Controller('bonuses')
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBonusDto: CreateBonusDto) {
    return this.bonusesService.create(createBonusDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.bonusesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bonusesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBonusDto: UpdateBonusDto) {
    return this.bonusesService.update(id, updateBonusDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bonusesService.remove(id);
  }
}
