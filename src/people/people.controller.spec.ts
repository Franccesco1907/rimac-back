import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePersonDto } from './dto/create-person.dto';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';

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

describe('PeopleController', () => {
  let peopleController: PeopleController;

  const mockPeopleService = {
    create: jest.fn(),
    findUntilPage: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [{ provide: PeopleService, useValue: mockPeopleService }],
    }).compile();

    peopleController = module.get<PeopleController>(PeopleController);
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createPersonDto: CreatePersonDto = peopleMock;
      const createdPerson = peopleMock;

      mockPeopleService.create.mockResolvedValue(createdPerson);

      const result = await peopleController.create(createPersonDto);

      expect(result).toEqual(createdPerson);
    });
  });

  describe('findUntilPage', () => {
    it('should retrieve people until the specified page', async () => {
      const page = '2';
      const people = [peopleMock, peopleMock, peopleMock, peopleMock, peopleMock];

      mockPeopleService.findUntilPage.mockResolvedValue(people);

      const result = await peopleController.findUntilPage(page);

      expect(result).toEqual(people);
    });
  });

  describe('findOne', () => {
    it('should retrieve person by id', async () => {
      const id = '1';
      const person = peopleMock;

      mockPeopleService.findOne.mockResolvedValue(person);

      const result = await peopleController.findOne(id);

      expect(result).toEqual(person);
    });
  });
});
