import { injectable } from 'inversify';
import { Book } from '../entities/book.interface';

export interface IBooksRepository {
  createBook(book: Omit<Book, 'id'>): Promise<Book>;
  getBook(id: string): Promise<Book | null>;
  getBooks(): Promise<Book[]>;
  updateBook(id: string, book: Partial<Book>): Promise<Book | null>;
  deleteBook(id: string): Promise<boolean>;
  findBooksByTitle(title: string): Promise<Book[]>;
}

@injectable()
export abstract class BooksRepository implements IBooksRepository {
  abstract createBook(book: Omit<Book, 'id'>): Promise<Book>;
  abstract getBook(id: string): Promise<Book | null>;
  abstract getBooks(): Promise<Book[]>;
  abstract updateBook(id: string, book: Partial<Book>): Promise<Book | null>;
  abstract deleteBook(id: string): Promise<boolean>;
  abstract findBooksByTitle(title: string): Promise<Book[]>;
}