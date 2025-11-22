import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from '../schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

const mockUserModel = {
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@test.com', age: 25 },
        { _id: '2', name: 'User 2', email: 'user2@test.com', age: 30 },
      ];

      mockUserModel.exec.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const mockUser = { _id: '1', name: 'Test User', email: 'test@test.com', age: 25 };
      
      mockUserModel.exec.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.exec.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});