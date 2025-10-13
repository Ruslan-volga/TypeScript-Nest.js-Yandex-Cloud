import { injectable } from 'inversify';
import { BooksRepository } from './books-repository.abstract';
import { Book } from '../entities/book.interface';

@injectable()
export class MockBooksRepository extends BooksRepository {
  private books: Book[] = [];
  private idCounter = 1;

  // Добавим несколько тестовых книг при создании
  constructor() {
    super();
    console.log('📚 MockBooksRepository initialized');
  }

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    console.log('🔄 Creating book:', book.title);
    const newBook: Book = {
      ...book,
      id: String(this.idCounter++)
    };
    this.books.push(newBook);
    console.log(`✅ Book created with ID: ${newBook.id}, total books: ${this.books.length}`);
    return newBook;
  }

  async getBook(id: string): Promise<Book | null> {
    console.log(`🔄 Getting book with ID: ${id}`);
    const book = this.books.find(book => book.id === id) || null;
    console.log(book ? `✅ Book found: ${book.title}` : '❌ Book not found');
    return book;
  }

  async getBooks(): Promise<Book[]> {
    console.log(`🔄 Getting all books, count: ${this.books.length}`);
    return [...this.books];
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    console.log(`🔄 Updating book with ID: ${id}`, updates);
    const bookIndex = this.books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      console.log('❌ Book not found for update');
      return null;
    }

    this.books[bookIndex] = { ...this.books[bookIndex], ...updates };
    console.log(`✅ Book updated: ${this.books[bookIndex].title}`);
    return this.books[bookIndex];
  }

  async deleteBook(id: string): Promise<boolean> {
    console.log(`🔄 Deleting book with ID: ${id}`);
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== id);
    const deleted = this.books.length < initialLength;
    console.log(deleted ? '✅ Book deleted' : '❌ Book not found for deletion');
    return deleted;
  }

  async findBooksByTitle(title: string): Promise<Book[]> {
    console.log(`🔄 Searching books with title: ${title}`);
    const foundBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
    console.log(`✅ Found ${foundBooks.length} books`);
    return foundBooks;
  }
}