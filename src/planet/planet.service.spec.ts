import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Planet } from './entities/planet.entity';
import { PlanetService } from './planet.service';

const baseURL = 'https://swapi.dev/api/planets';
const planetMock = {
  "name": "Tatooine",
  "rotation_period": "23",
  "orbital_period": "304",
  "diameter": "10465",
  "climate": "arid",
  "gravity": "1 standard",
  "terrain": "desert",
  "surface_water": "1",
  "population": "200000",
  "residents": [
    "https://swapi.dev/api/people/1/",
    "https://swapi.dev/api/people/2/",
    "https://swapi.dev/api/people/4/",
    "https://swapi.dev/api/people/6/",
    "https://swapi.dev/api/people/7/",
    "https://swapi.dev/api/people/8/",
    "https://swapi.dev/api/people/9/",
    "https://swapi.dev/api/people/11/",
    "https://swapi.dev/api/people/43/",
    "https://swapi.dev/api/people/62/"
  ],
  "films": [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/4/",
    "https://swapi.dev/api/films/5/",
    "https://swapi.dev/api/films/6/"
  ],
  "created": "2014-12-09T13:50:49.641000Z",
  "edited": "2014-12-20T20:58:18.411000Z",
  "url": "https://swapi.dev/api/planets/1/"
};
describe('PlanetService', () => {
  let planetService: PlanetService;

  const mockHttpService = {
    get: jest.fn(),
    axiosRef: { defaults: { baseURL } },
  };

  const mockPlanetRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: getRepositoryToken(Planet), useValue: mockPlanetRepository },
      ],
    }).compile();

    planetService = module.get<PlanetService>(PlanetService);
  });

  describe('create', () => {
    it('should create a planet', async () => {
      const createPlanetDto = planetMock;
      const savedPlanet = planetMock;
      
      mockPlanetRepository.save.mockResolvedValue(savedPlanet);

      const result = await planetService.create(createPlanetDto);
      expect(result).toEqual(savedPlanet);
    });
  });

  describe('findUntilPage', () => {
    it('should retrieve planets until the specified page', async () => {
      const page = 2;
      const mockResponse = {
        data: {
          // 5 planets per page
          results: [planetMock, planetMock, planetMock, planetMock, planetMock],
          next: baseURL + '?page=3',
        },
      };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await planetService.findUntilPage(page);
      // 5 planets per page * 2 pages = 10 planets
      expect(result).toHaveLength(10);
    });

    it('should throw HttpException if page is less than 1', async () => {
      const page = 0;

      await expect(planetService.findUntilPage(page)).rejects.toThrowError(
        new HttpException('The planets could not be retrieved', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('findOne', () => {
    it('should retrieve planet by id', async () => {
      const id = 1;
      const mockResponse = planetMock;
      
      mockPlanetRepository.findOneBy.mockResolvedValue(mockResponse);

      const result = await planetService.findOne(id);

      expect(result).toEqual(mockResponse);
    });

    it('should retrieve planet from external API if not found in repository', async () => {
      const id = 1;
      const mockResponse = planetMock;

      mockPlanetRepository.findOneBy.mockResolvedValue(undefined);
      mockHttpService.get.mockReturnValue(of({ data: mockResponse }));
      mockPlanetRepository.save.mockResolvedValue(mockResponse);

      const result = await planetService.findOne(id);

      expect(result).toEqual(mockResponse);
    });

    it('should throw HttpException if id is less than 1', async () => {
      const id = 0;

      await expect(planetService.findOne(id)).rejects.toThrowError(
        new HttpException('The planet could not be retrieved', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
