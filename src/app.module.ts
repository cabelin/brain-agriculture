import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RuralProducerModule } from './modules/rural-producer.module';
import { typeOrmModuleOptions } from '../db/data-source';

@Module({
  imports: [
    RuralProducerModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
