import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { Bonus } from './entities/bonus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bonus])],
  controllers: [BonusesController],
  providers: [BonusesService],
  exports: [BonusesService],
})
export class BonusesModule {}
