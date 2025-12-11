import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return this.booksService.remove(id);
  }
}