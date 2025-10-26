import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { BooksService } from './books.service';
import type { Book } from './books.service'; // ← используем import type

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Book[] {
    return this.booksService.findAll();
  }

  @Get(':id')
  getBook(@Param('id', ParseIntPipe) id: number): Book {
    const book = this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException('Книга не найдена');
    }
    return book;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBook(@Body() bookData: Omit<Book, 'id'>): Book {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Omit<Book, 'id'>>,
  ): Book {
    const updatedBook = this.booksService.update(id, updateData);
    if (!updatedBook) {
      throw new NotFoundException('Книга не найдена');
    }
    return updatedBook;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBook(@Param('id', ParseIntPipe) id: number): void {
    const isDeleted = this.booksService.remove(id);
    if (!isDeleted) {
      throw new NotFoundException('Книга не найдена');
    }
  }
}