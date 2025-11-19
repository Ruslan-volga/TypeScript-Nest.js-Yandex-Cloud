import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('users')
export class UserController {
  
  private users: User[] = [];
  private idCounter = 1;

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    const user: User = {
      id: this.idCounter++,
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    
    return {
      message: 'Пользователь успешно создан',
      user: user
    };
  }
  
  @Get()
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = this.users.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: this.users.length,
        totalPages: Math.ceil(this.users.length / limit)
      }
    };
  }
  
  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find(u => u.id === parseInt(id));
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    return {
      user: user,
      message: 'Данные пользователя получены'
    };
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userIndex = this.users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
      updatedAt: new Date()
    };
    
    return {
      message: 'Пользователь успешно обновлен',
      user: this.users[userIndex]
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string) {
    const userIndex = this.users.findIndex(u => u.id === parseInt(id));
    if (userIndex === -1) {
      throw new NotFoundException('Пользователь не найден');
    }
    
    this.users.splice(userIndex, 1);
    return null;
  }
}