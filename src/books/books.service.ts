import { Injectable } from '@nestjs/common';

export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
}

@Injectable()
export class BooksService {
  private books: Book[] = [
    { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869 },
    { id: 2, title: 'Преступление и наказание', author: 'Федор Достоевский', year: 1866 },
    { id: 3, title: '1984', author: 'Джордж Оруэлл', year: 1949 },
  ];

  private nextId = 4;

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  create(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      id: this.nextId++,
      ...book,
    };
    this.books.push(newBook);
    return newBook;
  }

  update(id: number, updatedBook: Partial<Omit<Book, 'id'>>): Book | undefined {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return undefined;
    }

    this.books[bookIndex] = {
      ...this.books[bookIndex],
      ...updatedBook,
    };

    return this.books[bookIndex];
  }

  remove(id: number): boolean {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return false;
    }

    this.books.splice(bookIndex, 1);
    return true;
  }
}