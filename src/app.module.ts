import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalsModule } from './hospitals/hospitals.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { WorkersModule } from './workers/workers.module';
import { LocationsModule } from './locations/locations.module';
import { SalaryModule } from './salary/salary.module';
import { BonusesModule } from './bonuses/bonuses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Msaa2006',
      database: 'n17',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    HospitalsModule,
    PatientsModule,
    AppointmentsModule,
    WorkersModule,
    LocationsModule,
    SalaryModule,
    BonusesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
