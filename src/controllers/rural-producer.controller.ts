import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RuralProducerCreateDto } from '../models/dto/rural-producer-create.dto';
import { RuralProducerUpdateDto } from '../models/dto/rural-producer-update.dto';
import { RuralProducerService } from '../services/rural-producer.service';

@Controller('rural-producers')
export class RuralProducerController {

    constructor(private readonly ruralProducerService: RuralProducerService) {}

    @Get()
    async findAll() {
      return this.ruralProducerService.findAll();
    }

    @Post()
    async create(@Body() ruralProducerCreateDto: RuralProducerCreateDto) {
      return this.ruralProducerService.create(ruralProducerCreateDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.ruralProducerService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() ruralproducerUpdateDto: RuralProducerUpdateDto) {
      return this.ruralProducerService.update(+id, ruralproducerUpdateDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.ruralProducerService.remove(+id);
    }

}
