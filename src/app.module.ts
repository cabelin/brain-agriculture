import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmModuleOptions } from '../db/data-source';
import { RuralProducerModule } from './modules/rural-producer.module';
import { ReportModule } from './modules/report.module';

@Module({
  imports: [
    RuralProducerModule,
    ReportModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
