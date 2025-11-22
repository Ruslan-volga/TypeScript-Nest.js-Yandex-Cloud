import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(0)
  age: number;

  isActive?: boolean;
}