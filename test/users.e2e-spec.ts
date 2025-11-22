import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return an array of users', () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@test.com', age: 25 },
        { _id: '2', name: 'User 2', email: 'user2@test.com', age: 30 },
      ];

      usersService.findAll.mockResolvedValue(mockUsers);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(mockUsers)
        .then(() => {
          expect(usersService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    it('should return empty array when no users', () => {
      usersService.findAll.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect([]);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', () => {
      const mockUser = { _id: '1', name: 'Test User', email: 'test@test.com', age: 25 };

      usersService.findOne.mockResolvedValue(mockUser);

      return request(app.getHttpServer())
        .get('/users/1')
        .expect(200)
        .expect(mockUser)
        .then(() => {
          expect(usersService.findOne).toHaveBeenCalledWith('1');
        });
    });

    it('should return 404 when user not found', () => {
      usersService.findOne.mockRejectedValue(new Error('Not found'));

      return request(app.getHttpServer())
        .get('/users/nonexistent')
        .expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@test.com',
        age: 28,
      };

      const createdUser = {
        _id: '1',
        ...createUserDto,
        isActive: true,
      };

      usersService.create.mockResolvedValue(createdUser);

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect(createdUser)
        .then(() => {
          expect(usersService.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    it('should return 400 for invalid data', () => {
      const invalidUserDto = {
        name: '', // invalid empty name
        email: 'invalid-email', // invalid email
        age: -5, // invalid age
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated User',
        age: 26,
      };

      const updatedUser = {
        _id: '1',
        name: 'Updated User',
        email: 'test@test.com',
        age: 26,
      };

      usersService.update.mockResolvedValue(updatedUser);

      return request(app.getHttpServer())
        .put('/users/1')
        .send(updateUserDto)
        .expect(200)
        .expect(updatedUser)
        .then(() => {
          expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
        });
    });

    it('should return 404 when updating non-existent user', () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };

      usersService.update.mockRejectedValue(new Error('Not found'));

      return request(app.getHttpServer())
        .put('/users/nonexistent')
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', () => {
      usersService.remove.mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .delete('/users/1')
        .expect(204)
        .then(() => {
          expect(usersService.remove).toHaveBeenCalledWith('1');
        });
    });

    it('should return 404 when deleting non-existent user', () => {
      usersService.remove.mockRejectedValue(new Error('Not found'));

      return request(app.getHttpServer())
        .delete('/users/nonexistent')
        .expect(404);
    });
  });
});