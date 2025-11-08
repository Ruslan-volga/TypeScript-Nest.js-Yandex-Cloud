import { 
  IsString, 
  IsEmail, 
  IsInt, 
  Min, 
  Max, 
  IsOptional,
  Length 
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  name?: string;
  
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsInt()
  @Min(18)
  @Max(100)
  @IsOptional()
  age?: number;
  
  @IsString()
  @IsOptional()
  @Length(6, 100)
  password?: string;
}