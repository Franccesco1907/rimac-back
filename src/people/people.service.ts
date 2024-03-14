import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeopleService {
  constructor(private readonly httpService: HttpService,
    @InjectRepository(People)
    private readonly peopleRepository: Repository<People>
    ) { }
  create(createPersonDto: CreatePersonDto) {
    const number = 10000;
    const random = number + Math.floor(Math.random() * number);

    return this.peopleRepository.save({ id: random, ...createPersonDto });
  }

  async findUntilPage(page: number) {
    try {
      if (page < 1) {
        throw new HttpException('Invalid page number', HttpStatus.BAD_REQUEST);
      }
      const people = [];
      let currentPage = 1;
      let nextPage = `${this.httpService.axiosRef.defaults.baseURL}?page=${currentPage}`;

      while (currentPage <= page) {
        const { data } = await firstValueFrom(this.httpService.get(nextPage));
        people.push(...data.results);
        nextPage = data.next;
        currentPage++;

        if (!nextPage || currentPage > page) {
          break;
        }
      }

      return people;
    } catch (error) {
      console.error(`The following error has ocurred: ${error}`);
      throw new HttpException(`The people could not be retrieved`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      if (id < 1) {
        throw new HttpException('Invalid id number', HttpStatus.BAD_REQUEST);
      }
      
      const people = await this.peopleRepository.findOneBy({ id });
      if (people) {
        return people;
      }

      const { data } = await firstValueFrom(this.httpService.get(`${id}`))
      
      await this.peopleRepository.save({ id, ...data });

      return data;
    } catch (error) {
      console.error(`The following error has ocurred: ${error}`);
      throw new HttpException(`The person could not be retrieved`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
