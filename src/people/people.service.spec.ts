import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { People } from './entities/people.entity';
import { PeopleService } from './people.service';

const baseURL = 'https://swapi.dev/api/people';
const peopleMock = {
  "name": "Luke Skywalker",
  "height": "172",
  "mass": "77",
  "hair_color": "blond",
  "skin_color": "fair",
  "eye_color": "blue",
  "birth_year": "19BBY",
  "gender": "male",
  "homeworld": "https://swapi.dev/api/planets/1/",
  "films": [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/2/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/6/"
  ],
  "species": [],
  "vehicles": [
    "https://swapi.dev/api/vehicles/14/",
    "https://swapi.dev/api/vehicles/30/"
  ],
  "starships": [
    "https://swapi.dev/api/starships/12/",
    "https://swapi.dev/api/starships/22/"
  ],
  "created": new Date(),
  "edited": new Date(),
  "url": "https://swapi.dev/api/people/1/"
};

describe('PeopleService', () => {
  let peopleService: PeopleService;

  const mockHttpService = {
    get: jest.fn(),
    axiosRef: { defaults: { baseURL } },
  };

  const mockPeopleRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: getRepositoryToken(People), useValue: mockPeopleRepository },
      ],
    }).compile();

    peopleService = module.get<PeopleService>(PeopleService);
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto = peopleMock;
      const savedPerson = peopleMock;

      mockPeopleRepository.save.mockResolvedValue(savedPerson);

      const result = await peopleService.create(createPersonDto);

      expect(result).toEqual(savedPerson);
    });
  });

  describe('findUntilPage', () => {
    it('should retrieve people until the specified page', async () => {
      const page = 2;
      const mockResponse = {
        data: {
          // 5 people per page
          results: [peopleMock, peopleMock, peopleMock, peopleMock, peopleMock],
          next: 'https://swapi.dev/people?page=3',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await peopleService.findUntilPage(page);
      // 5 people per page * 2 pages = 10 people
      expect(result).toHaveLength(10);
    });

    it('should throw HttpException if page is less than 1', async () => {
      const page = 0;

      await expect(peopleService.findUntilPage(page)).rejects.toThrowError(
        new HttpException('The people could not be retrieved', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve person by id', async () => {
      const id = 1;
      const mockResponse = peopleMock;

      mockPeopleRepository.findOneBy.mockResolvedValue(mockResponse);

      const result = await peopleService.findOne(id);

      expect(result).toEqual(mockResponse);
    });

    it('should retrieve person from external API if not found in repository', async () => {
      const id = 1;
      const mockResponse = peopleMock;

      mockPeopleRepository.findOneBy.mockResolvedValue(undefined);
      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));
      mockPeopleRepository.save.mockResolvedValue(mockResponse);

      const result = await peopleService.findOne(id);

      expect(result).toEqual(mockResponse);
    });

    it('should throw HttpException if id is less than 1', async () => {
      const id = 0;

      await expect(peopleService.findOne(id)).rejects.toThrowError(
        new HttpException('The person could not be retrieved', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
