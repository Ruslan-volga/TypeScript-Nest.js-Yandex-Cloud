import { BooksRepository } from './books-repository.abstract';
import { Book } from '../entities/book.interface';

export class MockBooksRepository extends BooksRepository {
  private books: Book[] = [];
  private idCounter = 1;

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const newBook: Book = {
      ...book,
      id: String(this.idCounter++)
    };
    this.books.push(newBook);
    return newBook;
  }

  async getBook(id: string): Promise<Book | null> {
    return this.books.find(book => book.id === id) || null;
  }

  async getBooks(): Promise<Book[]> {
    return [...this.books];
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) return null;

    this.books[bookIndex] = { ...this.books[bookIndex], ...updates };
    return this.books[bookIndex];
  }

  async deleteBook(id: string): Promise<boolean> {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== id);
    return this.books.length < initialLength;
  }

  async findBooksByTitle(title: string): Promise<Book[]> {
    return this.books.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }
}