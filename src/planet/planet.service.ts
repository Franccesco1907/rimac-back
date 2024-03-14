import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlanetDto } from './dto/create-planet.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Planet } from './entities/planet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlanetService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Planet)
    private readonly planetRepository: Repository<Planet>) { }

  create(createPlanetDto: CreatePlanetDto) {
    const number = 10000;
    const random = number + Math.floor(Math.random() * number);

    return this.planetRepository.save({ id: random, ...createPlanetDto });
  }

  async findUntilPage(page: number) {
    try {
      if (page < 1) {
        throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
      }
      const planets = [];
      let currentPage = 1;
      let nextPage = `${this.httpService.axiosRef.defaults.baseURL}?page=${currentPage}`;

      while (currentPage <= page) {
        const { data } = await firstValueFrom(this.httpService.get(nextPage));
        planets.push(...data.results);
        nextPage = data.next;
        currentPage++;

        if (!nextPage || currentPage > page) {
          break;
        }
      }

      return planets;
    } catch (error) {
      console.error(`The following error has ocurred: ${error}`);
      throw new HttpException(`The planets could not be retrieved`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      if (id < 1) {
        throw new HttpException('Invalid id number', HttpStatus.BAD_REQUEST);
      }

      const planet = await this.planetRepository.findOneBy({ id });
      if (planet) {
        return planet;
      }

      const { data } = await firstValueFrom(this.httpService.get(`${id}`))

      await this.planetRepository.save({ id, ...data });

      return data;
    } catch (error) {
      console.error(`The following error has ocurred: ${error}`);
      throw new HttpException(`The planet could not be retrieved`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
