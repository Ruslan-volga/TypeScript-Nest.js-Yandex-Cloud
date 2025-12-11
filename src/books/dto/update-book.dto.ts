import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(new Date().getFullYear())
  year?: number;

  @IsOptional()
  isAvailable?: boolean;
}