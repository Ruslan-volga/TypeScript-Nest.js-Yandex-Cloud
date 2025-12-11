// test/books.e2e-spec.ts
declare var describe: any;
declare var it: any;
declare var beforeAll: any;
declare var afterAll: any;
declare var beforeEach: any;
declare var afterEach: any;
declare var jest: any;
declare var expect: any;

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  
  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Добавляем ValidationPipe если используется валидация
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /books', () => {
    it('should return an array of books', async () => {
      const mockBooks = [
        { _id: '1', title: 'Book 1', author: 'Author 1', year: 2020 },
        { _id: '2', title: 'Book 2', author: 'Author 2', year: 2021 },
      ];

      mockBooksService.findAll.mockResolvedValue(mockBooks);

      const response = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      expect(response.body).toEqual(mockBooks);
      expect(mockBooksService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /books/:id', () => {
    it('should return a book by id', async () => {
      const mockBook = { 
        _id: '1', 
        title: 'Test Book', 
        author: 'Test Author', 
        year: 2020 
      };

      mockBooksService.findOne.mockResolvedValue(mockBook);

      const response = await request(app.getHttpServer())
        .get('/books/1')
        .expect(200);

      expect(response.body).toEqual(mockBook);
      expect(mockBooksService.findOne).toHaveBeenCalledWith('1');
      expect(mockBooksService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if book not found', async () => {
      // ИМЕННО ТАК! Сервис выбрасывает исключение, а не возвращает null
      mockBooksService.findOne.mockRejectedValue(
        new NotFoundException('Book with ID 999 not found')
      );

      const response = await request(app.getHttpServer())
        .get('/books/999')
        .expect(404);

      expect(response.body).toEqual({
        statusCode: 404,
        message: 'Book with ID 999 not found',
        error: 'Not Found'
      });
      expect(mockBooksService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'New Book',
        author: 'New Author',
        year: 2023,
      };

      const createdBook = {
        _id: '3',
        ...createBookDto,
      };

      mockBooksService.create.mockResolvedValue(createdBook);

      const response = await request(app.getHttpServer())
        .post('/books')
        .send(createBookDto)
        .set('Accept', 'application/json')
        .expect(201);

      expect(response.body).toEqual(createdBook);
      expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
      expect(mockBooksService.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for invalid data', async () => {
      const invalidBookDto = {
        title: '', // пустое название
        author: 'Author',
        year: 'not-a-number', // не число
      };

      await request(app.getHttpServer())
        .post('/books')
        .send(invalidBookDto)
        .expect(400);
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a book', async () => {
      const updateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        year: 2024,
      };

      const updatedBook = {
        _id: '1',
        ...updateBookDto,
      };

      mockBooksService.update.mockResolvedValue(updatedBook);

      const response = await request(app.getHttpServer())
        .put('/books/1')
        .send(updateBookDto)
        .expect(200);

      expect(response.body).toEqual(updatedBook);
      expect(mockBooksService.update).toHaveBeenCalledWith('1', updateBookDto);
    });

    it('should return 404 if book to update not found', async () => {
      const updateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        year: 2024,
      };

      mockBooksService.update.mockRejectedValue(
        new NotFoundException('Book with ID 999 not found')
      );

      await request(app.getHttpServer())
        .put('/books/999')
        .send(updateBookDto)
        .expect(404);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', async () => {
      const deletedBook = {
        _id: '1',
        title: 'Book to delete',
        author: 'Author',
        year: 2020,
      };

      mockBooksService.remove.mockResolvedValue(deletedBook);

      const response = await request(app.getHttpServer())
        .delete('/books/1')
        .expect(200);

      expect(response.body).toEqual(deletedBook);
      expect(mockBooksService.remove).toHaveBeenCalledWith('1');
    });

    it('should return 404 if book to delete not found', async () => {
      mockBooksService.remove.mockRejectedValue(
        new NotFoundException('Book with ID 999 not found')
      );

      await request(app.getHttpServer())
        .delete('/books/999')
        .expect(404);
    });
  });
});