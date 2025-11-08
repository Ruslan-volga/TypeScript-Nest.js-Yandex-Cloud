import { 
  IsString, 
  IsEmail, 
  IsInt, 
  Min, 
  Max, 
  IsNotEmpty,
  Length 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;
  
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;
  
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}