import { Test, TestingModule } from '@nestjs/testing';
import { PlanetController } from './planet.controller';
import { PlanetService } from './planet.service';

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

describe('PlanetController', () => {
  let planetController: PlanetController;

  const mockPlanetService = {
    create: jest.fn(),
    findUntilPage: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanetController],
      providers: [{ provide: PlanetService, useValue: mockPlanetService }],
    }).compile();

    planetController = module.get<PlanetController>(PlanetController);
  });

  describe('create', () => {
    it('should create a planet', async () => {
      const createPlanetDto = planetMock;
      const createdPlanet = planetMock;

      mockPlanetService.create.mockResolvedValue(createdPlanet);

      const result = await planetController.create(createPlanetDto);

      expect(result).toEqual(createdPlanet);
    });
  });

  describe('findUntilPage', () => {
    it('should retrieve planets until the specified page', async () => {
      const page = '2';
      const planets = [planetMock, planetMock, planetMock, planetMock, planetMock];

      mockPlanetService.findUntilPage.mockResolvedValue(planets);

      const result = await planetController.findUntilPage(page);

      expect(result).toEqual(planets);
    });
  });

  describe('findOne', () => {
    it('should retrieve a planet by id', async () => {
      const id = '1';
      const planet = planetMock;

      mockPlanetService.findOne.mockResolvedValue(planet);

      const result = await planetController.findOne(id);

      expect(result).toEqual(planet);
    });
  });
});
