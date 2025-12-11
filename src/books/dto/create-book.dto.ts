import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNumber()
  @Min(0)
  @Max(new Date().getFullYear())
  year: number;

  isAvailable?: boolean;
}