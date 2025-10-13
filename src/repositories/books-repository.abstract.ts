import { injectable } from 'inversify';
import { Book } from '../entities/book.interface';

@injectable() // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
export abstract class BooksRepository {
  abstract createBook(book: Omit<Book, 'id'>): Promise<Book>;
  abstract getBook(id: string): Promise<Book | null>;
  abstract getBooks(): Promise<Book[]>;
  abstract updateBook(id: string, book: Partial<Book>): Promise<Book | null>;
  abstract deleteBook(id: string): Promise<boolean>;
  abstract findBooksByTitle(title: string): Promise<Book[]>;
}