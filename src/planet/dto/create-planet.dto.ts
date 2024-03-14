import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsUrl } from "class-validator";

export class CreatePlanetDto {
  @ApiProperty()
  @IsString()
  climate: string;
  @ApiProperty()
  @IsString()
  diameter: string;
  @ApiProperty()
  @IsString()
  gravity: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  population: string;
  // @ApiProperty()
  // @IsArray()
  // @IsString({ each: true })
  // residents: string[];
  @ApiProperty()
  @IsString()
  terrain: string;
  @ApiProperty()
  @IsString()
  @IsUrl()
  url: string;
}
