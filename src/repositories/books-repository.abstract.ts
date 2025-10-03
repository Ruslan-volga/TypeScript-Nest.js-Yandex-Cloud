import { Book } from '../entities/book.interface';

export abstract class BooksRepository {
  // Создать новую книгу
  abstract createBook(book: Omit<Book, 'id'>): Promise<Book>;
  
  // Получить книгу по ID
  abstract getBook(id: string): Promise<Book | null>;
  
  // Получить все книги
  abstract getBooks(): Promise<Book[]>;
  
  // Обновить книгу
  abstract updateBook(id: string, book: Partial<Book>): Promise<Book | null>;
  
  // Удалить книгу
  abstract deleteBook(id: string): Promise<boolean>;
  
  // Найти книги по названию (опционально)
  abstract findBooksByTitle(title: string): Promise<Book[]>;
}