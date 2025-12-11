import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { Book } from '../schemas/book.schema';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: any;

  beforeEach(async () => {
    // Создаем мок для Mongoose модели с поддержкой конструктора
    mockBookModel = function(dto) {
      this.data = dto;
      this.save = jest.fn().mockResolvedValue({
        _id: 'generated-id',
        ...dto,
      });
    };

    // Мок для статических методов
    Object.assign(mockBookModel, {
      find: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      findByIdAndUpdate: jest.fn().mockReturnThis(),
      findByIdAndDelete: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        { _id: '1', title: 'Book 1', author: 'Author 1', year: 2020 },
        { _id: '2', title: 'Book 2', author: 'Author 2', year: 2021 },
      ];

      mockBookModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBooks),
      });

      const result = await service.findAll();
      expect(result).toEqual(mockBooks);
      expect(mockBookModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      const mockBook = { 
        _id: '1', 
        title: 'Test Book', 
        author: 'Test Author', 
        year: 2020 
      };

      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      });

      const result = await service.findOne('1');
      expect(result).toEqual(mockBook);
      expect(mockBookModel.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      expect(mockBookModel.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const createBookDto = {
        title: 'New Book',
        author: 'New Author',
        year: 2023,
      };

      const mockSavedBook = {
        _id: '3',
        ...createBookDto,
      };

      // Мокаем метод save
      const mockSave = jest.fn().mockResolvedValue(mockSavedBook);
      
      // При вызове new mockBookModel() возвращаем объект с методом save
      const MockBookModelClass = jest.fn().mockImplementation((dto) => {
        return {
          ...dto,
          save: mockSave,
        };
      });

      // Заменяем мок на класс
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BooksService,
          {
            provide: getModelToken('Book'),
            useValue: MockBookModelClass,
          },
        ],
      }).compile();

      const customService = module.get<BooksService>(BooksService);
      
      const result = await customService.create(createBookDto);
      expect(result).toEqual(mockSavedBook);
      expect(MockBookModelClass).toHaveBeenCalledWith(createBookDto);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const updateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        year: 2024,
      };

      const updatedBook = {
        _id: '1',
        ...updateBookDto,
      };

      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedBook),
      });

      const result = await service.update('1', updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateBookDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if book to update not found', async () => {
      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.update('999', { title: 'Updated' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return a book', async () => {
      const deletedBook = {
        _id: '1',
        title: 'Book to delete',
        author: 'Author',
        year: 2020,
      };

      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(deletedBook),
      });

      const result = await service.remove('1');
      expect(result).toEqual(deletedBook);
      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if book to delete not found', async () => {
      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
}); 