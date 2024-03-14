import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './entities/people.entity';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: `${configService.get('SWAPI_URL')}/people`
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([People])
  ],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
