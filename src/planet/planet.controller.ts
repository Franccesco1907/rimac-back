import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { PlanetService } from './planet.service';

@ApiTags('planets')
@Controller('planets')
export class PlanetController {
  constructor(private readonly planetService: PlanetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.OK, description: 'The planet was created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'The planet could not be created.' })
  @ApiInternalServerErrorResponse({ description: 'Swapi Server Error' })
  create(@Body() createPlanetDto: CreatePlanetDto) {
    return this.planetService.create(createPlanetDto);
  }
  
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The planets were retrieved.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'The planets could not be retrieved.' })
  @ApiInternalServerErrorResponse({ description: 'Swapi Server Error' })
  @ApiQuery({ name: 'page', required: true, type: String })
  findUntilPage(@Query('page') page: string) {
    return this.planetService.findUntilPage(+page);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, description: 'The planet was retrieved.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'The planet could not be retrieved.' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findOne(@Param('id') id: string) {
    return this.planetService.findOne(+id);
  }
}
