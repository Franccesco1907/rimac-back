import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";
export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  birth_year: string;
  @ApiProperty()
  @IsString()
  eye_color: string;
  @ApiProperty()
  @IsString()
  gender: string;
  @ApiProperty()
  @IsString()
  hair_color: string;
  @ApiProperty()
  @IsString()
  height: string;
  @ApiProperty()
  @IsString()
  homeworld: string;
  @ApiProperty()
  @IsString()
  mass: string;
  @ApiProperty()
  @IsString()
  skin_color: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  url: string;
  @ApiPropertyOptional()
  @IsString()
  created: Date;
  @ApiPropertyOptional()
  @IsString()
  edited: Date;
}
